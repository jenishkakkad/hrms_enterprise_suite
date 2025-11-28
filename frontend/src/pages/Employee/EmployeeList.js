import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const EmployeeList = () => {
  const { hasAnyRole } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Mock data - replace with API call
  const employees = [
    {
      id: 1,
      employee_id: 'EMP001',
      name: 'John Doe',
      email: 'john@company.com',
      phone: '+91 9876543210',
      department: 'IT',
      designation: 'Software Engineer',
      status: 'ACTIVE',
      joining_date: '2024-01-15',
      avatar: null
    },
    {
      id: 2,
      employee_id: 'EMP002',
      name: 'Jane Smith',
      email: 'jane@company.com',
      phone: '+91 9876543211',
      department: 'HR',
      designation: 'HR Manager',
      status: 'ACTIVE',
      joining_date: '2023-12-01',
      avatar: null
    },
    {
      id: 3,
      employee_id: 'EMP003',
      name: 'Mike Johnson',
      email: 'mike@company.com',
      phone: '+91 9876543212',
      department: 'Finance',
      designation: 'Accountant',
      status: 'INACTIVE',
      joining_date: '2024-02-10',
      avatar: null
    }
  ];

  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Sales'];
  const statuses = ['ACTIVE', 'INACTIVE', 'TERMINATED'];

  const filteredEmployees = employees.filter(employee => {
    return (
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (filterDepartment === '' || employee.department === filterDepartment) &&
    (filterStatus === '' || employee.status === filterStatus);
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-yellow-100 text-yellow-800';
      case 'TERMINATED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600">Manage your organization's employees</p>
        </div>
        {hasAnyRole(['COMPANY_ADMIN', 'HR_MANAGER']) && (
          <Link
            to="/employees/add"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Employee
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterDepartment('');
                setFilterStatus('');
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                  {employee.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{employee.name}</h3>
                  <p className="text-sm text-gray-500">{employee.employee_id}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.status)}`}>
                  {employee.status}
                </span>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-20 font-medium">Email:</span>
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-20 font-medium">Phone:</span>
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-20 font-medium">Dept:</span>
                  <span>{employee.department}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-20 font-medium">Role:</span>
                  <span>{employee.designation}</span>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <Link
                  to={`/employees/${employee.id}`}
                  className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm text-center hover:bg-blue-100 transition-colors"
                >
                  View Profile
                </Link>
                {hasAnyRole(['COMPANY_ADMIN', 'HR_MANAGER']) && (
                  <button className="flex-1 bg-gray-50 text-gray-600 px-3 py-2 rounded text-sm hover:bg-gray-100 transition-colors">
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or add new employees.</p>
        </div>
      )}

      {/* Stats */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Employee Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{employees.length}</div>
            <div className="text-sm text-gray-500">Total Employees</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {employees.filter(e => e.status === 'ACTIVE').length}
            </div>
            <div className="text-sm text-gray-500">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {employees.filter(e => e.status === 'INACTIVE').length}
            </div>
            <div className="text-sm text-gray-500">Inactive</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {employees.filter(e => e.status === 'TERMINATED').length}
            </div>
            <div className="text-sm text-gray-500">Terminated</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;