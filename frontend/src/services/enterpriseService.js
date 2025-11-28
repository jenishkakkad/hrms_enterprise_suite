import axios from 'axios';

class EnterpriseService {
  
  // Process any action dynamically
  static async processAction(module, action, data, context = {}) {
    try {
      const response = await axios.post('/api/enterprise/action', {
        module,
        action,
        data,
        context
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Action processing failed');
    }
  }

  // Get dashboard data
  static async getDashboardData() {
    try {
      const response = await axios.get('/api/enterprise/dashboard');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to load dashboard');
    }
  }

  // Get module configuration
  static async getModuleConfig(module) {
    try {
      const response = await axios.get(`/api/enterprise/module/${module}/config`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to load module config');
    }
  }

  // Update system configuration
  static async updateSystemConfig(module, configKey, configValue) {
    try {
      const response = await axios.put('/api/enterprise/config', {
        module,
        configKey,
        configValue
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update configuration');
    }
  }

  // Check user permissions
  static async checkPermission(module, action, context = {}) {
    try {
      const response = await this.processAction(module, 'CHECK_PERMISSION', {
        action
      }, context);
      return response.success;
    } catch (error) {
      return false;
    }
  }

  // Get user's effective permissions
  static async getUserPermissions() {
    try {
      const dashboardData = await this.getDashboardData();
      return dashboardData.data.permissions;
    } catch (error) {
      return {};
    }
  }
}

export default EnterpriseService;