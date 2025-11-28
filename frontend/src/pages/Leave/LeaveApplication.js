import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const LeaveApplication = () => {
  const [leaveBalance, setLeaveBalance] = useState({
    annual: { allocated: 21, used: 5, balance: 16 },
    sick: { allocated: 12, used: 2, balance: 10 },
    casual: { allocated: 12, used: 3, balance: 9 }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm();

  const leaveTypes = [
    { id: 'annual', name: 'Annual Leave', balance: leaveBalance.annual.balance },
    { id: 'sick', name: 'Sick Leave', balance: leaveBalance.sick.balance },
    { id: 'casual', name: 'Casual Leave', balance: leaveBalance.casual.balance },
    { id: 'maternity', name: 'Maternity Leave', balance: 90 },
    { id: 'paternity', name: 'Paternity Leave', balance: 15 }
  ];

  const recentApplications = [
    { id: 1, type: 'Annual Leave', from: '2024-01-20', to: '2024-01-22', days: 3, status: 'APPROVED' },
    { id: 2, type: 'Sick Leave', from: '2024-01-15', to: '2024-01-15', days: 1, status: 'PENDING' },
    { id: 3, type: 'Casual Leave', from: '2024-01-10', to: '2024-01-11', days: 2, status: 'REJECTED' }
  ];

  const fromDate = watch('from_date');
  const toDate = watch('to_date');
  const isHalfDay = watch('is_half_day');

  const calculateDays = () => {
    if (!fromDate || !toDate) return 0;
    if (isHalfDay) return 0.5;
    
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const onSubmit = async (data) => {
    try {
      const leaveData = {
        ...data,
        total_days: calculateDays(),
        applied_at: new Date()
      };
      
      console.log('Leave application:', leaveData);
      toast.success('Leave application submitted successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to submit leave application');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
        <p className="text-gray-600">Apply for leave and manage your leave balance</p>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(leaveBalance).map(([key, balance]) => (
          <div key={key} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 capitalize">{key} Leave</h3>
                <p className="text-sm text-gray-500">Available Balance</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{balance.balance}</div>
                <div className="text-xs text-gray-500">of {balance.allocated} days</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Used: {balance.used}</span>
                <span>Remaining: {balance.balance}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(balance.used / balance.allocated) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leave Application Form */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Apply for Leave</h3>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Leave Type *
              </label>
              <select
                {...register('leave_type', { required: 'Leave type is required' })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Leave Type</option>
                {leaveTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} (Balance: {type.balance})
                  </option>
                ))}
              </select>
              {errors.leave_type && (
                <p className="mt-1 text-sm text-red-600">{errors.leave_type.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date *
                </label>
                <input
                  {...register('from_date', { required: 'From date is required' })}
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.from_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.from_date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date *
                </label>
                <input
                  {...register('to_date', { required: 'To date is required' })}
                  type="date"
                  min={fromDate || new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.to_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.to_date.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <input
                {...register('is_half_day')}
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Half Day Leave
              </label>
            </div>

            {isHalfDay && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Half Day Session
                </label>
                <select
                  {...register('half_day_session')}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="FIRST_HALF">First Half (Morning)</option>
                  <option value="SECOND_HALF">Second Half (Afternoon)</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason *
              </label>
              <textarea
                {...register('reason', { required: 'Reason is required' })}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter reason for leave"
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                {...register('contact_number')}
                type="tel"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contact number during leave"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address During Leave
              </label>
              <textarea
                {...register('address_during_leave')}
                rows={2}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Address where you can be reached"
              />
            </div>

            {fromDate && toDate && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Total Days:</strong> {calculateDays()} day(s)
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit Application
            </button>
          </form>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Applications</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{application.type}</h4>
                      <p className="text-sm text-gray-500">
                        {application.from} to {application.to} ({application.days} day{application.days > 1 ? 's' : ''})
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <button className="text-blue-600 text-sm hover:underline">View Details</button>
                    {application.status === 'PENDING' && (
                      <button className="text-red-600 text-sm hover:underline">Cancel</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplication;