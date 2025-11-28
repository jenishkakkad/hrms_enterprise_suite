const SystemConfig = require('../models/SystemConfig');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const DynamicPermissionEngine = require('./dynamicPermissionEngine');

class EnterpriseWorkflowEngine {
  
  // Process any workflow dynamically
  static async processWorkflow(workflowType, data, userId, tenantId, context = {}) {
    try {
      // Get workflow configuration
      const workflowConfig = await SystemConfig.findOne({
        tenant_id: tenantId,
        module: 'WORKFLOW',
        config_key: `${workflowType.toUpperCase()}_WORKFLOW`
      });

      if (!workflowConfig) {
        throw new Error(`Workflow configuration not found for ${workflowType}`);
      }

      const workflow = workflowConfig.config_value;
      const result = { success: true, data: null, notifications: [], auditLogs: [] };

      // Execute workflow steps
      for (const step of workflow.steps) {
        const stepResult = await this.executeWorkflowStep(step, data, userId, tenantId, context);
        
        if (!stepResult.success) {
          result.success = false;
          result.error = stepResult.error;
          break;
        }

        // Merge results
        if (stepResult.data) result.data = { ...result.data, ...stepResult.data };
        if (stepResult.notifications) result.notifications.push(...stepResult.notifications);
        if (stepResult.auditLogs) result.auditLogs.push(...stepResult.auditLogs);
      }

      // Send notifications
      for (const notification of result.notifications) {
        await this.sendNotification(notification, tenantId);
      }

      // Create audit logs
      for (const auditLog of result.auditLogs) {
        await this.createAuditLog(auditLog, userId, tenantId);
      }

      return result;
    } catch (error) {
      console.error('Workflow processing error:', error);
      throw error;
    }
  }

  // Execute individual workflow step
  static async executeWorkflowStep(step, data, userId, tenantId, context) {
    try {
      switch (step.type) {
        case 'VALIDATION':
          return await this.executeValidation(step, data, context);
        case 'PERMISSION_CHECK':
          return await this.executePermissionCheck(step, userId, tenantId, context);
        case 'DATA_TRANSFORMATION':
          return await this.executeDataTransformation(step, data, context);
        case 'DATABASE_OPERATION':
          return await this.executeDatabaseOperation(step, data, tenantId, context);
        case 'NOTIFICATION':
          return await this.executeNotificationStep(step, data, context);
        case 'APPROVAL_ROUTING':
          return await this.executeApprovalRouting(step, data, tenantId, context);
        case 'STATE_CHANGE':
          return await this.executeStateChange(step, data, context);
        case 'INTEGRATION':
          return await this.executeIntegration(step, data, context);
        default:
          return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Execute validation step
  static async executeValidation(step, data, context) {
    const validations = step.config.validations;
    
    for (const validation of validations) {
      const isValid = await this.validateRule(validation, data, context);
      if (!isValid) {
        return { success: false, error: validation.error_message };
      }
    }
    
    return { success: true };
  }

  // Execute permission check
  static async executePermissionCheck(step, userId, tenantId, context) {
    const hasPermission = await DynamicPermissionEngine.hasPermission(
      userId, 
      tenantId, 
      step.config.module, 
      step.config.action, 
      context
    );
    
    if (!hasPermission) {
      return { success: false, error: 'Insufficient permissions' };
    }
    
    return { success: true };
  }

  // Execute data transformation
  static async executeDataTransformation(step, data, context) {
    const transformations = step.config.transformations;
    const transformedData = { ...data };
    
    for (const transformation of transformations) {
      transformedData[transformation.field] = this.applyTransformation(
        transformation.type,
        transformedData[transformation.field],
        transformation.config
      );
    }
    
    return { success: true, data: transformedData };
  }

  // Execute database operation
  static async executeDatabaseOperation(step, data, tenantId, context) {
    const { model, operation, config } = step.config;
    const Model = require(`../models/${model}`);
    
    let result;
    
    switch (operation) {
      case 'CREATE':
        result = await Model.create({ ...data, tenant_id: tenantId });
        break;
      case 'UPDATE':
        result = await Model.findByIdAndUpdate(
          config.id || data._id,
          { ...data, updated_at: new Date() },
          { new: true }
        );
        break;
      case 'DELETE':
        result = await Model.findByIdAndDelete(config.id || data._id);
        break;
      case 'FIND':
        result = await Model.find({ ...config.filter, tenant_id: tenantId });
        break;
    }
    
    return { success: true, data: { [model.toLowerCase()]: result } };
  }

  // Execute notification step
  static async executeNotificationStep(step, data, context) {
    const notifications = [];
    
    for (const notificationConfig of step.config.notifications) {
      const notification = {
        type: notificationConfig.type,
        recipients: this.resolveRecipients(notificationConfig.recipients, data, context),
        template: notificationConfig.template,
        data: data,
        priority: notificationConfig.priority || 'MEDIUM'
      };
      
      notifications.push(notification);
    }
    
    return { success: true, notifications };
  }

  // Execute approval routing
  static async executeApprovalRouting(step, data, tenantId, context) {
    const approvers = await this.getApprovers(step.config.approval_chain, data, tenantId);
    
    const approvalData = {
      approvers,
      current_step: 0,
      status: 'PENDING_APPROVAL',
      approval_chain: step.config.approval_chain
    };
    
    return { success: true, data: { approval: approvalData } };
  }

  // Execute state change
  static async executeStateChange(step, data, context) {
    const stateChanges = {};
    
    for (const change of step.config.state_changes) {
      stateChanges[change.field] = this.calculateNewState(
        change.type,
        data[change.field],
        change.config
      );
    }
    
    return { success: true, data: stateChanges };
  }

  // Execute integration
  static async executeIntegration(step, data, context) {
    // Integration with external systems
    const integrationResult = await this.callExternalAPI(
      step.config.endpoint,
      step.config.method,
      data,
      step.config.headers
    );
    
    return { success: true, data: { integration_result: integrationResult } };
  }

  // Validate rule
  static async validateRule(validation, data, context) {
    switch (validation.type) {
      case 'REQUIRED':
        return data[validation.field] !== undefined && data[validation.field] !== null;
      case 'MIN_LENGTH':
        return data[validation.field]?.length >= validation.value;
      case 'MAX_LENGTH':
        return data[validation.field]?.length <= validation.value;
      case 'REGEX':
        return new RegExp(validation.pattern).test(data[validation.field]);
      case 'CUSTOM':
        const customFunction = new Function('data', 'context', validation.expression);
        return customFunction(data, context);
      default:
        return true;
    }
  }

  // Apply transformation
  static applyTransformation(type, value, config) {
    switch (type) {
      case 'UPPERCASE':
        return value?.toString().toUpperCase();
      case 'LOWERCASE':
        return value?.toString().toLowerCase();
      case 'DATE_FORMAT':
        return new Date(value).toISOString();
      case 'CALCULATE':
        return eval(config.expression.replace('{{value}}', value));
      default:
        return value;
    }
  }

  // Resolve notification recipients
  static resolveRecipients(recipients, data, context) {
    return recipients.map(recipient => {
      if (recipient.type === 'ROLE') {
        return { type: 'ROLE', value: recipient.value };
      } else if (recipient.type === 'USER') {
        return { type: 'USER', value: data[recipient.field] };
      } else if (recipient.type === 'DYNAMIC') {
        return { type: 'USER', value: eval(recipient.expression) };
      }
    });
  }

  // Get approvers for approval chain
  static async getApprovers(approvalChain, data, tenantId) {
    const Employee = require('../models/Employee');
    const approvers = [];
    
    for (const step of approvalChain) {
      if (step.type === 'ROLE') {
        const roleApprovers = await Employee.find({
          tenant_id: tenantId,
          role: step.value,
          is_active: true
        });
        approvers.push(...roleApprovers);
      } else if (step.type === 'MANAGER') {
        const manager = await Employee.findById(data.manager_id);
        if (manager) approvers.push(manager);
      }
    }
    
    return approvers;
  }

  // Calculate new state
  static calculateNewState(type, currentValue, config) {
    switch (type) {
      case 'INCREMENT':
        return (currentValue || 0) + (config.value || 1);
      case 'DECREMENT':
        return (currentValue || 0) - (config.value || 1);
      case 'SET':
        return config.value;
      case 'CONDITIONAL':
        return eval(config.expression.replace('{{current}}', currentValue));
      default:
        return currentValue;
    }
  }

  // Call external API
  static async callExternalAPI(endpoint, method, data, headers) {
    const axios = require('axios');
    
    try {
      const response = await axios({
        method,
        url: endpoint,
        data,
        headers
      });
      
      return response.data;
    } catch (error) {
      console.error('External API call failed:', error);
      throw error;
    }
  }

  // Send notification
  static async sendNotification(notification, tenantId) {
    await Notification.create({
      tenant_id: tenantId,
      type: notification.type,
      recipients: notification.recipients,
      title: notification.template.title,
      message: notification.template.message,
      data: notification.data,
      priority: notification.priority,
      created_at: new Date()
    });
  }

  // Create audit log
  static async createAuditLog(auditLog, userId, tenantId) {
    await AuditLog.create({
      tenant_id: tenantId,
      user_id: userId,
      action: auditLog.action,
      resource_type: auditLog.resource_type,
      resource_id: auditLog.resource_id,
      changes: auditLog.changes,
      ip_address: auditLog.ip_address,
      user_agent: auditLog.user_agent,
      created_at: new Date()
    });
  }
}

module.exports = EnterpriseWorkflowEngine;