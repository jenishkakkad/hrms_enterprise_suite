import React, { useState } from 'react';
import { toast } from 'react-toastify';

const LeaveApproval = () => {
  const [filter, setFilter] = useState('PENDING');
  
  const leaveApplications = [
    {
      id: 1,
      employee: { name: 'John Doe', id: 'EMP001', department: 'IT' },
      type: 'Annual Leave',
      from: '2024-01-25',
      to: '2024-01-27',
      days: 3,
      reason: 'Family vacation',
      status: 'PENDING',
      appliedAt: '2024-01-20'
    },
    {
      id: 2,
      employee: { name: 'Jane Smith', id: 'EMP002', department: 'HR' },
      type: 'Sick Leave',
      from: '2024-01-22',
      to: '2024-01-22',
      days: 1,
      reason: 'Medical appointment',
      status: 'PENDING',
      appliedAt: '2024-01-21'
    }
  ];

  const handleApproval = async (applicationId, action, comments = '') => {
    try {
      console.log(`${action} application ${applicationId}:`, comments);
      toast.success(`Leave ${action.toLowerCase()} successfully!`);
    } catch (error) {
      toast.error(`Failed to ${action.toLowerCase()} leave`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leave Approvals</h1>
        <p className="text-gray-600">Review and approve leave applications</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['PENDING', 'APPROVED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  filter === status
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {status} ({leaveApplications.filter(app => app.status === status).length})
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {leaveApplications
              .filter(app => app.status === filter)
              .map((application) => (
                <div key={application.id} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                          {application.employee.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{application.employee.name}</h3>
                          <p className="text-sm text-gray-500">{application.employee.id} • {application.employee.department}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Leave Type</p>
                          <p className="text-gray-900">{application.type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Duration</p>
                          <p className="text-gray-900">{application.from} to {application.to} ({application.days} days)</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Reason</p>
                          <p className="text-gray-900">{application.reason}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Applied On</p>
                          <p className="text-gray-900">{new Date(application.appliedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(application.status)}`}>
                        {application.status}
                      </span>
                    </div>
                  </div>

                  {application.status === 'PENDING' && (
                    <div className="mt-6 flex space-x-3">
                      <button
                        onClick={() => handleApproval(application.id, 'APPROVED')}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Reason for rejection:');
                          if (reason) handleApproval(application.id, 'REJECTED', reason);
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                      >
                        ✗ Reject
                      </button>
                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors">
                        💬 Add Comment
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveApproval;