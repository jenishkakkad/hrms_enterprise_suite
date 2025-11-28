const EnterpriseWorkflowEngine = require('../services/enterpriseWorkflowEngine');
const DynamicPermissionEngine = require('../services/dynamicPermissionEngine');
const SystemConfig = require('../models/SystemConfig');

// Dynamic action processor
exports.processAction = async (req, res) => {
  try {
    const { module, action, data } = req.body;
    const userId = req.user.id;
    const tenantId = req.user.tenant_id;
    const userRole = req.user.role;

    // Check permissions
    const hasPermission = await DynamicPermissionEngine.hasPermission(
      userId, 
      tenantId, 
      module, 
      action, 
      { userRole, ...req.body.context }
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions for this action'
      });
    }

    // Process through workflow engine
    const result = await EnterpriseWorkflowEngine.processWorkflow(
      `${module}_${action}`,
      data,
      userId,
      tenantId,
      { userRole, ...req.body.context }
    );

    res.json({
      success: result.success,
      data: result.data,
      message: result.success ? 'Action processed successfully' : result.error
    });

  } catch (error) {
    console.error('Action processing error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user's dashboard data dynamically
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const tenantId = req.user.tenant_id;
    const userRole = req.user.role;

    // Get user permissions
    const permissions = await DynamicPermissionEngine.getUserPermissions(userId, tenantId, userRole);

    // Get dashboard configuration
    const dashboardConfig = await SystemConfig.findOne({
      tenant_id: tenantId,
      module: 'DASHBOARD',
      config_key: `${userRole}_DASHBOARD_CONFIG`
    });

    const dashboardData = {
      permissions,
      widgets: [],
      quickActions: [],
      notifications: [],
      stats: {}
    };

    if (dashboardConfig) {
      // Process each widget based on permissions
      for (const widget of dashboardConfig.config_value.widgets) {
        const canAccess = await DynamicPermissionEngine.canAccessModule(
          userId, 
          tenantId, 
          widget.module, 
          userRole
        );

        if (canAccess) {
          const widgetData = await this.getWidgetData(widget, userId, tenantId);
          dashboardData.widgets.push({
            ...widget,
            data: widgetData
          });
        }
      }

      // Process quick actions
      for (const action of dashboardConfig.config_value.quickActions) {
        const hasPermission = await DynamicPermissionEngine.hasPermission(
          userId,
          tenantId,
          action.module,
          action.action,
          { userRole }
        );

        if (hasPermission) {
          dashboardData.quickActions.push(action);
        }
      }
    }

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get widget data dynamically
exports.getWidgetData = async (widget, userId, tenantId) => {
  try {
    const Model = require(`../models/${widget.dataSource.model}`);
    
    let query = { tenant_id: tenantId };
    
    // Apply filters based on widget configuration
    if (widget.dataSource.filters) {
      for (const filter of widget.dataSource.filters) {
        if (filter.type === 'USER_SPECIFIC') {
          query[filter.field] = userId;
        } else if (filter.type === 'DATE_RANGE') {
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - filter.days);
          query[filter.field] = { $gte: startDate };
        } else if (filter.type === 'STATUS') {
          query[filter.field] = filter.value;
        }
      }
    }

    let result;
    
    switch (widget.type) {
      case 'COUNT':
        result = await Model.countDocuments(query);
        break;
      case 'LIST':
        result = await Model.find(query)
          .limit(widget.dataSource.limit || 10)
          .sort(widget.dataSource.sort || { created_at: -1 });
        break;
      case 'AGGREGATE':
        result = await Model.aggregate(widget.dataSource.pipeline);
        break;
      default:
        result = await Model.find(query).limit(5);
    }

    return result;
  } catch (error) {
    console.error('Widget data error:', error);
    return null;
  }
};

// Get module configuration
exports.getModuleConfig = async (req, res) => {
  try {
    const { module } = req.params;
    const tenantId = req.user.tenant_id;
    const userRole = req.user.role;

    // Check module access
    const canAccess = await DynamicPermissionEngine.canAccessModule(
      req.user.id,
      tenantId,
      module,
      userRole
    );

    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: 'Module access denied'
      });
    }

    // Get module configuration
    const moduleConfig = await SystemConfig.find({
      tenant_id: tenantId,
      module: module.toUpperCase()
    });

    // Get user permissions for this module
    const permissions = await DynamicPermissionEngine.getUserPermissions(
      req.user.id,
      tenantId,
      userRole
    );

    res.json({
      success: true,
      data: {
        config: moduleConfig,
        permissions: permissions[module.toUpperCase()] || [],
        userRole
      }
    });

  } catch (error) {
    console.error('Module config error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update system configuration
exports.updateSystemConfig = async (req, res) => {
  try {
    const { module, configKey, configValue } = req.body;
    const tenantId = req.user.tenant_id;
    const userId = req.user.id;

    // Check admin permissions
    const hasPermission = await DynamicPermissionEngine.hasPermission(
      userId,
      tenantId,
      'SYSTEM',
      'CONFIGURE',
      { userRole: req.user.role }
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to update system configuration'
      });
    }

    const config = await SystemConfig.findOneAndUpdate(
      {
        tenant_id: tenantId,
        module: module.toUpperCase(),
        config_key: configKey
      },
      {
        config_value: configValue,
        updated_by: userId,
        updated_at: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      data: config,
      message: 'Configuration updated successfully'
    });

  } catch (error) {
    console.error('Config update error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};