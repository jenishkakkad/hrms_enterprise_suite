import React from 'react';
import { useAuthStore } from '../../store/authStore';
import EmployeeDashboard from './EmployeeDashboard';

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.name || 'User'}! 👋
        </h1>
        <p className="mt-2 text-blue-100">
          Here's what's happening in your workspace today.
        </p>
      </div>

      <EmployeeDashboard />
    </div>
  );
};

export default Dashboard;