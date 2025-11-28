import React from 'react';
import { useAuthStore } from '../../store/authStore';

const RoleBasedRoute = ({ children, allowedRoles, requiredFeature }) => {
  const { user, hasAnyRole, hasFeature } = useAuthStore();

  // Check role access
  if (allowedRoles && !hasAnyRole(allowedRoles)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-500 mt-2">Required role: {allowedRoles.join(' or ')}</p>
          <p className="text-sm text-gray-500">Your role: {user?.role}</p>
        </div>
      </div>
    );
  }

  // Check feature access
  if (requiredFeature && !hasFeature(requiredFeature)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Feature Not Available</h2>
          <p className="text-gray-600">This feature is not included in your current plan.</p>
          <p className="text-sm text-gray-500 mt-2">Required feature: {requiredFeature}</p>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Upgrade Plan
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleBasedRoute;