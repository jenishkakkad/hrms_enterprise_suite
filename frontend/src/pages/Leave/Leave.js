import React from 'react';
import DynamicModule from '../../components/DynamicModule';
import EmployeeLeaveInterface from './EmployeeLeaveInterface';
import HRLeaveInterface from './HRLeaveInterface';
import ManagerLeaveInterface from './ManagerLeaveInterface';
import { useAuthStore } from '../../store/authStore';

const Leave = () => {
  const { user } = useAuthStore();

  const renderRoleBasedInterface = (props) => {
    switch (user?.role) {
      case 'EMPLOYEE':
        return <EmployeeLeaveInterface {...props} />;
      case 'HR_MANAGER':
        return <HRLeaveInterface {...props} />;
      case 'TEAM_LEAD':
      case 'MANAGER':
        return <ManagerLeaveInterface {...props} />;
      default:
        return (
          <div className="p-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-yellow-800">⚠️ Role Not Configured</h3>
              <p className="mt-2 text-sm text-yellow-700">
                Leave management interface is not configured for role: {user?.role}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <DynamicModule module="LEAVE">
      {renderRoleBasedInterface}
    </DynamicModule>
  );
};

export default Leave;