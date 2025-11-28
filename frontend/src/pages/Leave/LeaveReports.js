import React, { useState } from 'react';

const LeaveReports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const leaveStats = {
    totalApplications: 45,
    approved: 38,
    pending: 4,
    rejected: 3,
    averageDays: 2.3
  };

  const departmentData = [
    { department: 'IT', total: 15, approved: 13, pending: 1, rejected: 1 },
    { department: 'HR', total: 8, approved: 7, pending: 1, rejected: 0 },
    { department: 'Finance', total: 12, approved: 10, pending: 1, rejected: 1 },
    { department: 'Marketing', total: 10, approved: 8, pending: 1, rejected: 1 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leave Reports</h1>
        <p className="text-gray-600">Analyze leave patterns and trends</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="monthly">This Month</option>
              <option value="quarterly">This Quarter</option>
              <option value="yearly">This Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="all">All Departments</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{leaveStats.totalApplications}</div>
            <div className="text-sm text-gray-500">Total Applications</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{leaveStats.approved}</div>
            <div className="text-sm text-gray-500">Approved</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{leaveStats.pending}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{leaveStats.rejected}</div>
            <div className="text-sm text-gray-500">Rejected</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{leaveStats.averageDays}</div>
            <div className="text-sm text-gray-500">Avg Days</div>
          </div>
        </div>
      </div>

      {/* Department Wise Report */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Department-wise Leave Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pending</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rejected</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approval Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentData.map((dept) => (
                <tr key={dept.department} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{dept.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{dept.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600">{dept.approved}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-yellow-600">{dept.pending}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-red-600">{dept.rejected}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {((dept.approved / dept.total) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveReports;