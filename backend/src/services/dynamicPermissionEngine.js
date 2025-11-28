const Permission = require('../models/Permission');
const SystemConfig = require('../models/SystemConfig');

class DynamicPermissionEngine {
  
  // Check if user has permission for specific action
  static async hasPermission(userId, tenantId, module, action, context = {}) {
    try {
      // Get user permissions
      const permissions = await Permission.find({
        $or: [
          { user_id: userId },
          { role: context.userRole }
        ],
        tenant_id: tenantId,
        module: module.toUpperCase(),
        is_active: true
      });

      // Check direct permission
      const hasDirectPermission = permissions.some(p => 
        p.actions.includes(action.toUpperCase()) && 
        this.evaluateConditions(p.conditions, context)
      );

      if (hasDirectPermission) return true;

      // Check system-level permissions
      const systemPermissions = await SystemConfig.findOne({
        tenant_id: tenantId,
        module: 'PERMISSIONS',
        config_key: `${module.toUpperCase()}_${action.toUpperCase()}_RULES`
      });

      if (systemPermissions) {
        return this.evaluateSystemRules(systemPermissions.config_value, context);
      }

      return false;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }

  // Evaluate permission conditions dynamically
  static evaluateConditions(conditions, context) {
    if (!conditions || conditions.length === 0) return true;

    return conditions.every(condition => {
      switch (condition.type) {
        case 'ROLE_MATCH':
          return condition.value.includes(context.userRole);
        case 'DEPARTMENT_MATCH':
          return condition.value.includes(context.userDepartment);
        case 'REPORTING_HIERARCHY':
          return this.checkReportingHierarchy(condition.value, context);
        case 'TIME_BASED':
          return this.checkTimeConstraints(condition.value, context);
        case 'DATA_OWNERSHIP':
          return this.checkDataOwnership(condition.value, context);
        default:
          return true;
      }
    });
  }

  // Check reporting hierarchy
  static checkReportingHierarchy(config, context) {
    if (config.allow_subordinates && context.isSubordinate) return true;
    if (config.allow_peers && context.isPeer) return true;
    if (config.allow_superiors && context.isSuperior) return true;
    return false;
  }

  // Check time-based constraints
  static checkTimeConstraints(config, context) {
    const now = new Date();
    const currentHour = now.getHours();
    
    if (config.business_hours_only) {
      return currentHour >= 9 && currentHour <= 18;
    }
    
    if (config.allowed_days) {
      const currentDay = now.getDay();
      return config.allowed_days.includes(currentDay);
    }
    
    return true;
  }

  // Check data ownership
  static checkDataOwnership(config, context) {
    if (config.own_data_only) {
      return context.resourceOwnerId === context.userId;
    }
    
    if (config.department_data_only) {
      return context.resourceDepartment === context.userDepartment;
    }
    
    return true;
  }

  // Evaluate system-level rules
  static evaluateSystemRules(rules, context) {
    try {
      // Dynamic rule evaluation
      const ruleFunction = new Function('context', `return ${rules.expression}`);
      return ruleFunction(context);
    } catch (error) {
      console.error('Rule evaluation error:', error);
      return false;
    }
  }

  // Get user's effective permissions
  static async getUserPermissions(userId, tenantId, userRole) {
    const permissions = await Permission.find({
      $or: [
        { user_id: userId },
        { role: userRole }
      ],
      tenant_id: tenantId,
      is_active: true
    });

    const effectivePermissions = {};
    
    permissions.forEach(permission => {
      if (!effectivePermissions[permission.module]) {
        effectivePermissions[permission.module] = [];
      }
      effectivePermissions[permission.module] = [
        ...effectivePermissions[permission.module],
        ...permission.actions
      ];
    });

    return effectivePermissions;
  }

  // Check module access
  static async canAccessModule(userId, tenantId, module, userRole) {
    return await this.hasPermission(userId, tenantId, module, 'READ', { userRole });
  }
}

module.exports = DynamicPermissionEngine;