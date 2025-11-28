const { Permission, Role, Policy } = require('../models/Permission');
const Employee = require('../models/Employee');

class PermissionService {
  
  // Seed default permissions
  async seedDefaultPermissions() {
    const permissions = [
      // Employee Management
      { name: 'Create Employee', code: 'EMPLOYEE_CREATE', module: 'EMPLOYEE', action: 'CREATE' },
      { name: 'View Employee', code: 'EMPLOYEE_READ', module: 'EMPLOYEE', action: 'READ' },
      { name: 'Update Employee', code: 'EMPLOYEE_UPDATE', module: 'EMPLOYEE', action: 'UPDATE' },
      { name: 'Delete Employee', code: 'EMPLOYEE_DELETE', module: 'EMPLOYEE', action: 'DELETE' },
      
      // Leave Management
      { name: 'Apply Leave', code: 'LEAVE_CREATE', module: 'LEAVE', action: 'CREATE' },
      { name: 'View Leaves', code: 'LEAVE_READ', module: 'LEAVE', action: 'READ' },
      { name: 'Update Leave', code: 'LEAVE_UPDATE', module: 'LEAVE', action: 'UPDATE' },
      { name: 'Approve Leave', code: 'LEAVE_APPROVE', module: 'LEAVE', action: 'APPROVE' },
      
      // Attendance
      { name: 'Mark Attendance', code: 'ATTENDANCE_CREATE', module: 'ATTENDANCE', action: 'CREATE' },
      { name: 'View Attendance', code: 'ATTENDANCE_READ', module: 'ATTENDANCE', action: 'READ' },
      { name: 'Update Attendance', code: 'ATTENDANCE_UPDATE', module: 'ATTENDANCE', action: 'UPDATE' },
      
      // Payroll
      { name: 'Process Payroll', code: 'PAYROLL_CREATE', module: 'PAYROLL', action: 'CREATE' },
      { name: 'View Payroll', code: 'PAYROLL_READ', module: 'PAYROLL', action: 'READ' },
      { name: 'Update Payroll', code: 'PAYROLL_UPDATE', module: 'PAYROLL', action: 'UPDATE' },
      
      // Reports
      { name: 'View Reports', code: 'REPORTS_READ', module: 'REPORTS', action: 'READ' },
      { name: 'Export Reports', code: 'REPORTS_EXPORT', module: 'REPORTS', action: 'EXPORT' },
      
      // Admin
      { name: 'Manage Settings', code: 'ADMIN_UPDATE', module: 'ADMIN', action: 'UPDATE' },
      { name: 'Manage Users', code: 'ADMIN_CREATE', module: 'ADMIN', action: 'CREATE' }
    ];

    for (const perm of permissions) {
      await Permission.findOneAndUpdate(
        { code: perm.code },
        { ...perm, is_system: true },
        { upsert: true }
      );
    }
  }

  // Seed default roles
  async seedDefaultRoles() {
    const roles = [
      {
        name: 'Employee',
        code: 'EMPLOYEE',
        permissions: ['LEAVE_CREATE', 'LEAVE_READ', 'ATTENDANCE_CREATE', 'ATTENDANCE_READ', 'PAYROLL_READ'],
        level: 1,
        is_system: true
      },
      {
        name: 'Team Lead',
        code: 'TEAM_LEAD',
        permissions: ['LEAVE_READ', 'LEAVE_APPROVE', 'ATTENDANCE_READ', 'ATTENDANCE_UPDATE', 'EMPLOYEE_READ', 'REPORTS_READ'],
        level: 2,
        is_system: true
      },
      {
        name: 'HR Manager',
        code: 'HR_MANAGER',
        permissions: ['EMPLOYEE_CREATE', 'EMPLOYEE_READ', 'EMPLOYEE_UPDATE', 'LEAVE_READ', 'LEAVE_APPROVE', 'PAYROLL_CREATE', 'PAYROLL_READ', 'REPORTS_READ', 'REPORTS_EXPORT'],
        level: 3,
        is_system: true
      },
      {
        name: 'Company Admin',
        code: 'COMPANY_ADMIN',
        permissions: ['*'], // All permissions
        level: 4,
        is_system: true
      }
    ];

    for (const roleData of roles) {
      const permissions = await Permission.find({
        code: { $in: roleData.permissions === ['*'] ? undefined : roleData.permissions }
      });

      const rolePermissions = roleData.permissions === ['*'] 
        ? (await Permission.find({})).map(p => ({ permission_id: p._id, granted: true }))
        : permissions.map(p => ({ permission_id: p._id, granted: true }));

      await Role.findOneAndUpdate(
        { code: roleData.code, tenant_id: null },
        {
          name: roleData.name,
          code: roleData.code,
          permissions: rolePermissions,
          level: roleData.level,
          is_system: roleData.is_system
        },
        { upsert: true }
      );
    }
  }

  // Check if user has permission
  async hasPermission(userId, module, action, resourceId = null) {
    try {
      const employee = await Employee.findById(userId)
        .populate('role_id')
        .populate('additional_permissions.permission_id');

      if (!employee) return false;

      // Super admin has all permissions
      if (employee.role === 'SUPER_ADMIN') return true;

      // Check role permissions
      if (employee.role_id) {
        const hasRolePermission = employee.role_id.permissions.some(p => 
          p.permission_id.module === module.toUpperCase() && 
          p.permission_id.action === action.toUpperCase() &&
          p.granted
        );
        if (hasRolePermission) return true;
      }

      // Check additional permissions
      const hasAdditionalPermission = employee.additional_permissions.some(p =>
        p.permission_id.module === module.toUpperCase() &&
        p.permission_id.action === action.toUpperCase() &&
        p.granted &&
        (!p.expires_at || p.expires_at > new Date())
      );

      return hasAdditionalPermission;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }

  // Get user permissions
  async getUserPermissions(userId) {
    try {
      const employee = await Employee.findById(userId)
        .populate({
          path: 'role_id',
          populate: { path: 'permissions.permission_id' }
        })
        .populate('additional_permissions.permission_id');

      const permissions = [];

      // Role permissions
      if (employee.role_id) {
        employee.role_id.permissions.forEach(p => {
          if (p.granted) {
            permissions.push({
              code: p.permission_id.code,
              module: p.permission_id.module,
              action: p.permission_id.action,
              source: 'role'
            });
          }
        });
      }

      // Additional permissions
      employee.additional_permissions.forEach(p => {
        if (p.granted && (!p.expires_at || p.expires_at > new Date())) {
          permissions.push({
            code: p.permission_id.code,
            module: p.permission_id.module,
            action: p.permission_id.action,
            source: 'additional',
            expires_at: p.expires_at
          });
        }
      });

      return permissions;
    } catch (error) {
      console.error('Get permissions error:', error);
      return [];
    }
  }

  // Create company policy
  async createPolicy(tenantId, policyData, createdBy) {
    try {
      const policy = new Policy({
        tenant_id: tenantId,
        ...policyData,
        created_by: createdBy
      });

      await policy.save();
      return policy;
    } catch (error) {
      throw new Error(`Failed to create policy: ${error.message}`);
    }
  }

  // Evaluate policies for action
  async evaluatePolicies(tenantId, module, action, employee, context = {}) {
    try {
      const policies = await Policy.find({
        tenant_id: tenantId,
        type: module.toUpperCase(),
        is_active: true,
        effective_from: { $lte: new Date() },
        $or: [
          { effective_to: null },
          { effective_to: { $gte: new Date() } }
        ]
      });

      for (const policy of policies) {
        const result = this.evaluatePolicy(policy, employee, context);
        if (!result.allowed) {
          return result;
        }
      }

      return { allowed: true };
    } catch (error) {
      return { allowed: false, reason: 'Policy evaluation error' };
    }
  }

  // Evaluate single policy
  evaluatePolicy(policy, employee, context) {
    // Check if policy applies to this employee
    if (!this.policyAppliesTo(policy, employee)) {
      return { allowed: true };
    }

    // Evaluate rules
    for (const rule of policy.rules) {
      if (!rule.is_active) continue;

      const result = this.evaluateRule(rule, employee, context);
      if (!result.allowed) {
        return result;
      }
    }

    return { allowed: true };
  }

  // Check if policy applies to employee
  policyAppliesTo(policy, employee) {
    const { applies_to } = policy;

    if (applies_to.roles?.length && !applies_to.roles.includes(employee.role)) {
      return false;
    }

    if (applies_to.departments?.length && !applies_to.departments.includes(employee.department_id?.toString())) {
      return false;
    }

    if (applies_to.employees?.length && !applies_to.employees.includes(employee._id)) {
      return false;
    }

    return true;
  }

  // Evaluate rule
  evaluateRule(rule, employee, context) {
    const { condition, action, value } = rule;

    switch (condition) {
      case 'MAX_LEAVE_DAYS':
        if (context.total_days > value) {
          return { allowed: false, reason: `Maximum ${value} days allowed` };
        }
        break;

      case 'WORKING_HOURS_ONLY':
        const hour = new Date().getHours();
        if (hour < value.start || hour > value.end) {
          return { allowed: false, reason: `Action only allowed during ${value.start}:00-${value.end}:00` };
        }
        break;

      case 'APPROVAL_HIERARCHY':
        if (!this.checkHierarchy(employee, context.targetEmployee)) {
          return { allowed: false, reason: 'Insufficient hierarchy level' };
        }
        break;

      default:
        break;
    }

    return { allowed: true };
  }

  // Check hierarchy
  checkHierarchy(approver, targetEmployee) {
    // Simplified hierarchy check
    return true;
  }
}

module.exports = new PermissionService();