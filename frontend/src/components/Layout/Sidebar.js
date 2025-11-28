import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { user, hasAnyRole, hasFeature } = useAuthStore();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: '📊',
      roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'HR_MANAGER', 'TEAM_LEAD', 'EMPLOYEE']
    },
    {
      name: 'Employees',
      href: '/employees',
      icon: '👥',
      roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'HR_MANAGER', 'TEAM_LEAD'],
      children: [
        { name: 'Employee List', href: '/employees' },
        { name: 'Add Employee', href: '/employees/add', roles: ['COMPANY_ADMIN', 'HR_MANAGER'] }
      ]
    },
    {
      name: 'Attendance',
      href: '/attendance',
      icon: '⏰',
      roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'HR_MANAGER', 'TEAM_LEAD', 'EMPLOYEE'],
      children: [
        { name: 'Mark Attendance', href: '/attendance' },
        { name: 'Reports', href: '/attendance/reports', roles: ['COMPANY_ADMIN', 'HR_MANAGER', 'TEAM_LEAD'] }
      ]
    },
    {
      name: 'Leave Management',
      href: '/leaves',
      icon: '🏖️',
      roles: ['HR_MANAGER', 'EMPLOYEE'], // ONLY HR_MANAGER and EMPLOYEE
      children: [
        { name: 'My Leaves', href: '/leaves', roles: ['EMPLOYEE'] },
        { name: 'Leave Approvals', href: '/leaves', roles: ['HR_MANAGER'] }
      ]
    },
    {
      name: 'Payroll',
      href: '/payroll',
      icon: '💰',
      roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'HR_MANAGER', 'EMPLOYEE'],
      feature: 'payroll',
      children: [
        { name: 'Dashboard', href: '/payroll' },
        { name: 'Salary Slips', href: '/payroll/salary-slips' }
      ]
    },
    {
      name: 'Performance',
      href: '/performance',
      icon: '📈',
      roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'HR_MANAGER', 'TEAM_LEAD', 'EMPLOYEE'],
      feature: 'performance',
      children: [
        { name: 'Reviews', href: '/performance' },
        { name: 'KPI Dashboard', href: '/performance/kpi' }
      ]
    },
    {
      name: 'Tasks',
      href: '/tasks',
      icon: '✅',
      roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'HR_MANAGER', 'TEAM_LEAD', 'EMPLOYEE']
    }
  ];

  const adminNavigation = [
    {
      name: 'Company Settings',
      href: '/admin/settings',
      icon: '⚙️',
      roles: ['COMPANY_ADMIN']
    },
    {
      name: 'User Management',
      href: '/admin/users',
      icon: '👤',
      roles: ['COMPANY_ADMIN']
    },
    {
      name: 'Subscription',
      href: '/admin/subscription',
      icon: '💳',
      roles: ['COMPANY_ADMIN']
    }
  ];

  const superAdminNavigation = [
    {
      name: 'SaaS Dashboard',
      href: '/super-admin',
      icon: '🚀',
      roles: ['SUPER_ADMIN']
    },
    {
      name: 'Companies',
      href: '/super-admin/companies',
      icon: '🏢',
      roles: ['SUPER_ADMIN']
    },
    {
      name: 'Plans',
      href: '/super-admin/plans',
      icon: '📦',
      roles: ['SUPER_ADMIN']
    }
  ];

  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const canAccess = (item) => {
    if (!hasAnyRole(item.roles)) return false;
    if (item.feature && !hasFeature(item.feature)) return false;
    return true;
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-center h-16 bg-blue-600">
          <div className="flex items-center">
            <div className="text-white text-2xl font-bold">HRMS</div>
            <div className="ml-2 text-blue-200 text-sm">SaaS</div>
          </div>
        </div>

        <nav className="mt-5 px-2 space-y-1">
          {navigation.filter(canAccess).map((item) => (
            <div key={item.name}>
              <Link
                to={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
                {item.feature && !hasFeature(item.feature) && (
                  <span className="ml-auto text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Pro
                  </span>
                )}
              </Link>
              {item.children && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.filter(child => !child.roles || hasAnyRole(child.roles)).map((child) => (
                    <Link
                      key={child.name}
                      to={child.href}
                      className={`block px-2 py-1 text-xs rounded-md transition-colors ${
                        isActive(child.href)
                          ? 'bg-blue-50 text-blue-800'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {user?.role === 'COMPANY_ADMIN' && (
            <>
              <div className="pt-4">
                <div className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Administration
                </div>
              </div>
              {adminNavigation.filter(canAccess).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </>
          )}

          {user?.role === 'SUPER_ADMIN' && (
            <>
              <div className="pt-4">
                <div className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Super Admin
                </div>
              </div>
              {superAdminNavigation.filter(canAccess).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-red-100 text-red-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="absolute bottom-0 w-full p-4 bg-gray-50 border-t">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;