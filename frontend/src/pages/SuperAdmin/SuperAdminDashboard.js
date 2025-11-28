import React from 'react';

const SuperAdminDashboard = () => {
  const stats = {
    totalCompanies: 156,
    activeCompanies: 142,
    totalUsers: 3420,
    monthlyRevenue: 485000,
    newSignups: 12,
    churnRate: 2.3
  };

  const recentCompanies = [
    { name: 'Tech Solutions Ltd', plan: 'GOLD', employees: 250, joinDate: '2024-01-20', status: 'ACTIVE' },
    { name: 'Digital Marketing Co', plan: 'MEDIUM', employees: 85, joinDate: '2024-01-19', status: 'TRIAL' },
    { name: 'Finance Corp', plan: 'BASIC', employees: 25, joinDate: '2024-01-18', status: 'ACTIVE' }
  ];

  const planDistribution = [
    { plan: 'BASIC', count: 78, percentage: 50 },
    { plan: 'MEDIUM', count: 54, percentage: 35 },
    { plan: 'GOLD', count: 24, percentage: 15 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">SaaS Dashboard</h1>
        <p className="text-gray-600">Monitor your HRMS platform performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">🏢</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Companies</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCompanies}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">✅</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Companies</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeCompanies}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">👥</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">💰</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{(stats.monthlyRevenue / 100000).toFixed(1)}L</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">📈</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">New Signups</p>
              <p className="text-2xl font-bold text-gray-900">{stats.newSignups}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">📉</div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Churn Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.churnRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Companies */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Companies</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentCompanies.map((company, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{company.name}</h4>
                    <p className="text-sm text-gray-500">
                      {company.plan} Plan • {company.employees} employees
                    </p>
                    <p className="text-xs text-gray-400">
                      Joined: {new Date(company.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    company.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {company.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Plan Distribution</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {planDistribution.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{item.plan} Plan</span>
                    <span>{item.count} companies ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.plan === 'BASIC' ? 'bg-gray-500' :
                        item.plan === 'MEDIUM' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">🏢</div>
              <div className="text-sm font-medium">Manage Companies</div>
            </div>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">📦</div>
              <div className="text-sm font-medium">Manage Plans</div>
            </div>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium">Analytics</div>
            </div>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">⚙️</div>
              <div className="text-sm font-medium">System Settings</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;