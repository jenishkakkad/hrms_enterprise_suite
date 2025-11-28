const { Permission, Role, Policy } = require('../models/Permission');
const Employee = require('../models/Employee');

class DynamicAuthMiddleware {
  
  // Check if user has specific permission
  static checkPermission(module, action, conditions = {}) {
    return async (req, res, next) => {
      try {
        const user = req.user;
        
        // Get user's role and permissions
        const employee = await Employee.findById(user.id)
          .populate({
            path: 'role_id',
            populate: {
              path: 'permissions.permission_id'
            }
          });

        if (!employee || !employee.role_id) {
          return res.status(403).json({
            success: false,
            message: 'No role assigned'
          });
        }

        // Check if user has the required permission
        const hasPermission = await this.hasPermission(
          employee, 
          module, 
          action, 
          conditions,
          req
        );

        if (!hasPermission) {
          return res.status(403).json({
            success: false,
            message: `Access denied. Required permission: ${module}.${action}`,
            user_role: employee.role_id.name
          });
        }

        // Apply data filtering based on permission conditions
        req.dataFilter = await this.getDataFilter(employee, module, conditions);
        
        next();
      } catch (error) {
        res.status(500).json({
          success: false,
          message: 'Authorization error',
          error: error.message
        });
      }
    };
  }

  // Check permission with policy evaluation
  static async hasPermission(employee, module, action, conditions, req) {
    try {
      // System admin has all permissions
      if (employee.role === 'SUPER_ADMIN') {
        return true;
      }

      // Find required permission
      const permission = await Permission.findOne({
        module: module.toUpperCase(),
        action: action.toUpperCase()
      });

      if (!permission) {
        return false;
      }

      // Check if role has this permission
      const rolePermission = employee.role_id.permissions.find(
        p => p.permission_id._id.toString() === permission._id.toString() && p.granted
      );

      if (!rolePermission) {
        return false;
      }

      // Evaluate company policies
      const policyResult = await this.evaluatePolicies(
        employee.tenant_id,
        module,
        action,
        employee,
        req
      );

      if (!policyResult.allowed) {
        return false;
      }

      // Check permission conditions
      if (rolePermission.conditions) {
        return this.checkConditions(rolePermission.conditions, employee, req);
      }

      return true;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }

  // Evaluate company policies
  static async evaluatePolicies(tenantId, module, action, employee, req) {
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
        // Check if policy applies to this user
        const applies = this.checkPolicyApplicability(policy, employee);
        
        if (applies) {
          // Evaluate policy rules
          const ruleResult = this.evaluatePolicyRules(policy.rules, employee, req);
          if (!ruleResult.allowed) {
            return ruleResult;
          }
        }
      }

      return { allowed: true };
    } catch (error) {
      return { allowed: false, reason: 'Policy evaluation error' };
    }
  }

  // Check if policy applies to user
  static checkPolicyApplicability(policy, employee) {
    const { applies_to } = policy;
    
    // Check roles
    if (applies_to.roles && applies_to.roles.length > 0) {
      if (!applies_to.roles.includes(employee.role)) {
        return false;
      }
    }
    
    // Check departments
    if (applies_to.departments && applies_to.departments.length > 0) {
      if (!employee.department_id || 
          !applies_to.departments.includes(employee.department_id.toString())) {
        return false;
      }
    }
    
    // Check specific employees
    if (applies_to.employees && applies_to.employees.length > 0) {
      if (!applies_to.employees.includes(employee._id)) {
        return false;
      }
    }
    
    return true;
  }

  // Evaluate policy rules
  static evaluatePolicyRules(rules, employee, req) {
    for (const rule of rules) {
      if (!rule.is_active) continue;
      
      try {
        const result = this.evaluateRule(rule, employee, req);
        if (!result.allowed) {
          return result;
        }
      } catch (error) {
        console.error('Rule evaluation error:', error);
      }
    }
    
    return { allowed: true };
  }

  // Evaluate individual rule
  static evaluateRule(rule, employee, req) {
    const { condition, action, value } = rule;
    
    switch (condition) {
      case 'MAX_LEAVE_DAYS':
        if (req.body.total_days > value) {
          return { 
            allowed: false, 
            reason: `Maximum ${value} days allowed per application` 
          };
        }
        break;
        
      case 'WORKING_HOURS':
        const currentHour = new Date().getHours();
        if (currentHour < value.start || currentHour > value.end) {
          return { 
            allowed: false, 
            reason: `Action only allowed during working hours (${value.start}:00 - ${value.end}:00)` 
          };
        }
        break;
        
      case 'APPROVAL_HIERARCHY':
        // Check if user can approve based on hierarchy
        if (action === 'DENY' && !this.checkHierarchy(employee, req.targetEmployee)) {
          return { 
            allowed: false, 
            reason: 'Cannot approve/reject for employees outside your hierarchy' 
          };
        }
        break;
        
      default:
        break;
    }
    
    return { allowed: true };
  }

  // Check permission conditions
  static checkConditions(conditions, employee, req) {
    if (conditions.own_data_only) {
      // User can only access their own data
      const targetEmployeeId = req.params.employeeId || req.body.employee_id || req.query.employee_id;
      if (targetEmployeeId && targetEmployeeId !== employee._id.toString()) {
        return false;
      }
    }
    
    if (conditions.department_only) {
      // User can only access data from their department
      const targetDepartment = req.params.departmentId || req.body.department_id;
      if (targetDepartment && targetDepartment !== employee.department_id?.toString()) {
        return false;
      }
    }
    
    if (conditions.reporting_hierarchy) {
      // User can only access data of their reportees
      return this.checkReportingHierarchy(employee, req);
    }
    
    return true;
  }

  // Get data filter based on permissions
  static async getDataFilter(employee, module, conditions) {
    const filter = { tenant_id: employee.tenant_id };
    
    // Apply role-based filtering
    switch (employee.role) {
      case 'EMPLOYEE':
        filter.employee_id = employee._id;
        break;
        
      case 'TEAM_LEAD':
        // Can see own team data
        const teamMembers = await Employee.find({
          tenant_id: employee.tenant_id,
          reporting_manager: employee._id
        }).select('_id');
        
        filter.$or = [
          { employee_id: employee._id },
          { employee_id: { $in: teamMembers.map(m => m._id) } }
        ];
        break;
        
      case 'HR_MANAGER':
      case 'COMPANY_ADMIN':
        // Can see all company data (filter already has tenant_id)
        break;
        
      default:
        filter.employee_id = employee._id;
    }
    
    return filter;
  }

  // Check reporting hierarchy
  static checkReportingHierarchy(employee, req) {
    // Implementation for checking if target employee reports to current user
    return true; // Simplified for now
  }

  // Check hierarchy for approvals
  static checkHierarchy(approver, targetEmployee) {
    // Implementation for checking approval hierarchy
    return true; // Simplified for now
  }
}

module.exports = DynamicAuthMiddleware;