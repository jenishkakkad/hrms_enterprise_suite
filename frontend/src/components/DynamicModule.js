import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import EnterpriseService from '../services/enterpriseService';
import { toast } from 'react-toastify';

const DynamicModule = ({ module, children }) => {
  const [moduleConfig, setModuleConfig] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    loadModuleConfig();
  }, [module]);

  const loadModuleConfig = async () => {
    try {
      setLoading(true);
      const response = await EnterpriseService.getModuleConfig(module);
      setModuleConfig(response.data.config);
      setPermissions(response.data.permissions);
    } catch (error) {
      console.error('Failed to load module config:', error);
      toast.error('Failed to load module configuration');
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (action) => {
    return permissions.includes(action.toUpperCase());
  };

  const processAction = async (action, data, context = {}) => {
    try {
      const response = await EnterpriseService.processAction(
        module,
        action,
        data,
        { ...context, userRole: user.role }
      );
      
      if (response.success) {
        toast.success(response.message || 'Action completed successfully');
        return response.data;
      } else {
        toast.error(response.message || 'Action failed');
        return null;
      }
    } catch (error) {
      toast.error(error.message);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading module...</span>
      </div>
    );
  }

  if (!hasPermission('READ')) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-red-800">🚫 Access Denied</h3>
          <p className="mt-2 text-sm text-red-700">
            You don't have permission to access the {module} module.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dynamic-module" data-module={module}>
      {React.cloneElement(children, {
        moduleConfig,
        permissions,
        hasPermission,
        processAction,
        userRole: user.role
      })}
    </div>
  );
};

export default DynamicModule;