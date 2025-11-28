import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const EmployeeProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('personal');

  // Mock employee data - replace with API call
  const employee = {
    id: 1,
    employee_id: 'EMP001',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@company.com',
    phone: '+91 9876543210',
    department: 'IT',
    designation: 'Software Engineer',
    status: 'ACTIVE',
    joining_date: '2024-01-15',
    date_of_birth: '1990-05-15',
    gender: 'Male',
    address: '123 Main St, City, State 12345',
    emergency_contact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+91 9876543211'
    },
    salary: {
      basic: 50000,
      hra: 20000,
      allowances: 10000,
      gross: 80000
    },
    documents: [
      { type: 'Aadhar', number: 'XXXX-XXXX-1234', verified: true },
      { type: 'PAN', number: 'ABCDE1234F', verified: true },
      { type: 'Resume', uploaded: true }
    ]
  };

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: '👤' },
    { id: 'job', name: 'Job Details', icon: '💼' },
    { id: 'salary', name: 'Salary', icon: '💰' },
    { id: 'documents', name: 'Documents', icon: '📄' },
    { id: 'attendance', name: 'Attendance', icon: '⏰' },
    { id: 'leaves', name: 'Leaves', icon: '🏖️' }
  ];

  const renderPersonalInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">Full Name</label>
            <p className="text-gray-900">{employee.first_name} {employee.last_name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Employee ID</label>
            <p className="text-gray-900">{employee.employee_id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900">{employee.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Phone</label>
            <p className="text-gray-900">{employee.phone}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Date of Birth</label>
            <p className="text-gray-900">{employee.date_of_birth}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Gender</label>
            <p className="text-gray-900">{employee.gender}</p>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">Address</label>
            <p className="text-gray-900">{employee.address}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Emergency Contact</label>
            <p className="text-gray-900">{employee.emergency_contact.name}</p>
            <p className="text-sm text-gray-500">{employee.emergency_contact.relationship} - {employee.emergency_contact.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobDetails = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Job Information</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">Department</label>
            <p className="text-gray-900">{employee.department}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Designation</label>
            <p className="text-gray-900">{employee.designation}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Joining Date</label>
            <p className="text-gray-900">{employee.joining_date}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Status</label>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              employee.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {employee.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSalaryInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Salary Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Basic Salary</span>
            <span className="font-medium">₹{employee.salary.basic.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">HRA</span>
            <span className="font-medium">₹{employee.salary.hra.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Allowances</span>
            <span className="font-medium">₹{employee.salary.allowances.toLocaleString()}</span>
          </div>
          <div className="border-t pt-2 flex justify-between">
            <span className="font-medium text-gray-900">Gross Salary</span>
            <span className="font-bold text-lg">₹{employee.salary.gross.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
      <div className="space-y-3">
        {employee.documents.map((doc, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">{doc.type}</p>
              {doc.number && <p className="text-sm text-gray-500">{doc.number}</p>}
            </div>
            <div className="flex items-center space-x-2">
              {doc.verified && (
                <span className="text-green-600 text-sm">✓ Verified</span>
              )}
              <button className="text-blue-600 text-sm hover:underline">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalInfo();
      case 'job':
        return renderJobDetails();
      case 'salary':
        return renderSalaryInfo();
      case 'documents':
        return renderDocuments();
      case 'attendance':
        return <div className="text-center py-8 text-gray-500">Attendance history will be displayed here</div>;
      case 'leaves':
        return <div className="text-center py-8 text-gray-500">Leave history will be displayed here</div>;
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {employee.first_name.charAt(0)}{employee.last_name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {employee.first_name} {employee.last_name}
            </h1>
            <p className="text-gray-600">{employee.designation} • {employee.department}</p>
            <p className="text-sm text-gray-500">Employee ID: {employee.employee_id}</p>
          </div>
          <div className="ml-auto">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;