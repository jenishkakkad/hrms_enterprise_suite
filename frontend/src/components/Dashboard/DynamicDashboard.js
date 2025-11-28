import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';

const DynamicDashboard = () => {
  const [widgets, setWidgets] = useState({});
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate permission-based data fetching
      const mockWidgets = {
        attendance: { present: 22, absent: 2, late: 1 },
        leaveBalance: { available: 15, used: 6, pending: 1 },
        pendingApprovals: [
          { name: 'John Doe', status: 'Pending', type: 'Sick Leave' },
          { name: 'Jane Smith', status: 'Pending', type: 'Annual Leave' }
        ],
        teamOverview: { present: 8, absent: 1, onLeave: 2 },
        companyStats: { total_employees: 150, active: 145, on_leave: 5, new_hires: 3 }
      };
      
      setWidgets(mockWidgets);
      
      // Mock permissions based on role
      const rolePermissions = getRolePermissions(user?.role);
      setPermissions(rolePermissions);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRolePermissions = (role) => {
    const permissionMap = {
      'EMPLOYEE': [
        { module: 'ATTENDANCE', action: 'READ' },
        { module: 'ATTENDANCE', action: 'CREATE' },
        { module: 'LEAVE', action: 'READ' },
        { module: 'LEAVE', action: 'CREATE' }
      ],
      'HR_MANAGER': [
        { module: 'ATTENDANCE', action: 'READ' },
        { module: 'LEAVE', action: 'READ' },
        { module: 'LEAVE', action: 'APPROVE' },
        { module: 'EMPLOYEE', action: 'READ' },
        { module: 'EMPLOYEE', action: 'CREATE' },
        { module: 'REPORTS', action: 'READ' },
        { module: 'REPORTS', action: 'EXPORT' }
      ],
      'COMPANY_ADMIN': [
        { module: 'ATTENDANCE', action: 'READ' },
        { module: 'LEAVE', action: 'READ' },
        { module: 'LEAVE', action: 'APPROVE' },
        { module: 'EMPLOYEE', action: 'READ' },
        { module: 'EMPLOYEE', action: 'CREATE' },
        { module: 'REPORTS', action: 'READ' },
        { module: 'REPORTS', action: 'EXPORT' },
        { module: 'ADMIN', action: 'UPDATE' }
      ]
    };
    
    return permissionMap[role] || [];
  };

  const hasPermission = (module, action) => {
    return permissions.some(p => 
      p.module === module && p.action === action
    );
  };

  const getWidgetsForRole = () => {
    const roleWidgets = [];

    if (hasPermission('ATTENDANCE', 'READ')) {
      roleWidgets.push({
        id: 'attendance',
        title: 'My Attendance',
        type: 'stat',
        data: widgets.attendance || { present: 0, absent: 0, late: 0 }
      });
    }

    if (hasPermission('LEAVE', 'READ')) {
      roleWidgets.push({
        id: 'leave-balance',
        title: 'Leave Balance',
        type: 'stat',
        data: widgets.leaveBalance || { available: 0, used: 0, pending: 0 }
      });
    }

    if (hasPermission('LEAVE', 'APPROVE')) {
      roleWidgets.push({
        id: 'pending-approvals',
        title: 'Pending Approvals',
        type: 'list',
        data: widgets.pendingApprovals || []
      });
    }

    if (hasPermission('EMPLOYEE', 'READ')) {
      roleWidgets.push({
        id: 'team-overview',
        title: 'Team Overview',
        type: 'chart',
        data: widgets.teamOverview || { present: 0, absent: 0, onLeave: 0 }
      });
    }

    if (hasPermission('REPORTS', 'READ')) {
      roleWidgets.push({
        id: 'company-stats',
        title: 'Company Statistics',
        type: 'grid',
        data: widgets.companyStats || {}
      });
    }

    return roleWidgets;
  };

  const renderWidget = (widget) => {
    switch (widget.type) {
      case 'stat':
        return <StatWidget key={widget.id} widget={widget} />;
      case 'list':
        return <ListWidget key={widget.id} widget={widget} />;
      case 'chart':
        return <ChartWidget key={widget.id} widget={widget} />;
      case 'grid':
        return <GridWidget key={widget.id} widget={widget} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const userWidgets = getWidgetsForRole();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's your {user?.role?.toLowerCase().replace('_', ' ')} dashboard
        </p>
      </div>

      {userWidgets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">
            No dashboard widgets available for your current permissions.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {userWidgets.map(renderWidget)}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {hasPermission('LEAVE', 'CREATE') && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Apply Leave
            </button>
          )}
          {hasPermission('ATTENDANCE', 'CREATE') && (
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Mark Attendance
            </button>
          )}
          {hasPermission('EMPLOYEE', 'CREATE') && (
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
              Add Employee
            </button>
          )}
          {hasPermission('REPORTS', 'EXPORT') && (
            <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700">
              Generate Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const StatWidget = ({ widget }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-sm font-medium text-gray-500 mb-2">{widget.title}</h3>
    <div className="grid grid-cols-3 gap-4 text-center">
      {Object.entries(widget.data).map(([key, value]) => (
        <div key={key}>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-xs text-gray-500 capitalize">{key}</div>
        </div>
      ))}
    </div>
  </div>
);

const ListWidget = ({ widget }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-sm font-medium text-gray-500 mb-4">{widget.title}</h3>
    <div className="space-y-3">
      {widget.data.slice(0, 5).map((item, index) => (
        <div key={index} className="flex justify-between items-center">
          <span className="text-sm text-gray-900">{item.name}</span>
          <span className="text-xs text-gray-500">{item.status}</span>
        </div>
      ))}
    </div>
  </div>
);

const ChartWidget = ({ widget }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-sm font-medium text-gray-500 mb-4">{widget.title}</h3>
    <div className="h-32 flex items-end justify-around">
      {Object.entries(widget.data).map(([key, value]) => (
        <div key={key} className="text-center">
          <div 
            className="bg-blue-500 rounded-t"
            style={{ height: `${(value / Math.max(...Object.values(widget.data))) * 100}px`, width: '20px' }}
          ></div>
          <div className="text-xs mt-1 capitalize">{key}</div>
        </div>
      ))}
    </div>
  </div>
);

const GridWidget = ({ widget }) => (
  <div className="bg-white rounded-lg shadow p-6 col-span-2">
    <h3 className="text-sm font-medium text-gray-500 mb-4">{widget.title}</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(widget.data).map(([key, value]) => (
        <div key={key} className="text-center">
          <div className="text-xl font-bold text-gray-900">{value}</div>
          <div className="text-xs text-gray-500 capitalize">{key.replace('_', ' ')}</div>
        </div>
      ))}
    </div>
  </div>
);

export default DynamicDashboard;