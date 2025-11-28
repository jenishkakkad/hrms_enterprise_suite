import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';

const EmployeeLeave = () => {
  const [activeTab, setActiveTab] = useState('apply');
  const [leaves, setLeaves] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  useEffect(() => {
    fetchLeaveTypes();
    fetchMyLeaves();
    fetchLeaveBalance();
  }, []);

  const fetchLeaveTypes = async () => {
    try {
      const response = await axios.get('/leaves/types');
      setLeaveTypes(response.data.data);
    } catch (error) {
      toast.error('Error fetching leave types');
    }
  };

  const fetchMyLeaves = async () => {
    try {
      const response = await axios.get('/leaves/my-leaves');
      setLeaves(response.data.data.leaves);
    } catch (error) {
      toast.error('Error fetching leaves');
    }
  };

  const fetchLeaveBalance = async () => {
    try {
      const response = await axios.get('/leaves/my-balance');
      setLeaveBalance(response.data.data);
    } catch (error) {
      toast.error('Error fetching leave balance');
    }
  };

  const onSubmitLeave = async (data) => {
    setLoading(true);
    try {
      await axios.post('/leaves/apply', data);
      toast.success('Leave application submitted successfully');
      reset();
      fetchMyLeaves();
      fetchLeaveBalance();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error applying leave');
    }
    setLoading(false);
  };

  const cancelLeave = async (leaveId) => {
    if (!window.confirm('Are you sure you want to cancel this leave?')) return;
    
    try {
      await axios.put(`/leaves/cancel/${leaveId}`, {
        cancellation_reason: 'Cancelled by employee'
      });
      toast.success('Leave cancelled successfully');
      fetchMyLeaves();
      fetchLeaveBalance();
    } catch (error) {
      toast.error('Error cancelling leave');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className=\"p-6\">
      <div className=\"mb-6\">
        <h1 className=\"text-2xl font-bold text-gray-900\">Leave Management</h1>
        <p className=\"text-gray-600\">Apply for leaves and track your applications</p>
      </div>

      {/* Tabs */}
      <div className=\"border-b border-gray-200 mb-6\">
        <nav className=\"-mb-px flex space-x-8\">
          <button
            onClick={() => setActiveTab('apply')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'apply'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Apply Leave
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Leave History
          </button>
          <button
            onClick={() => setActiveTab('balance')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'balance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Leave Balance
          </button>
        </nav>
      </div>

      {/* Apply Leave Tab */}
      {activeTab === 'apply' && (
        <div className=\"bg-white rounded-lg shadow p-6\">
          <h2 className=\"text-lg font-semibold mb-4\">Apply for Leave</h2>
          <form onSubmit={handleSubmit(onSubmitLeave)} className=\"space-y-4\">
            <div className=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-1\">
                  Leave Type *
                </label>
                <select
                  {...register('leave_type_id', { required: 'Leave type is required' })}
                  className=\"w-full border border-gray-300 rounded-md px-3 py-2\"
                >
                  <option value=\"\">Select Leave Type</option>
                  {leaveTypes.map(type => (
                    <option key={type._id} value={type._id}>{type.name}</option>
                  ))}
                </select>
                {errors.leave_type_id && (
                  <p className=\"text-red-500 text-sm mt-1\">{errors.leave_type_id.message}</p>
                )}
              </div>

              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-1\">
                  From Date *
                </label>
                <input
                  type=\"date\"
                  {...register('from_date', { required: 'From date is required' })}
                  className=\"w-full border border-gray-300 rounded-md px-3 py-2\"
                />
                {errors.from_date && (
                  <p className=\"text-red-500 text-sm mt-1\">{errors.from_date.message}</p>
                )}
              </div>

              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-1\">
                  To Date *
                </label>
                <input
                  type=\"date\"
                  {...register('to_date', { required: 'To date is required' })}
                  className=\"w-full border border-gray-300 rounded-md px-3 py-2\"
                />
                {errors.to_date && (
                  <p className=\"text-red-500 text-sm mt-1\">{errors.to_date.message}</p>
                )}
              </div>

              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-1\">
                  Contact Number
                </label>
                <input
                  type=\"tel\"
                  {...register('contact_number')}
                  className=\"w-full border border-gray-300 rounded-md px-3 py-2\"
                  placeholder=\"Contact number during leave\"
                />
              </div>
            </div>

            <div>
              <label className=\"flex items-center\">
                <input
                  type=\"checkbox\"
                  {...register('is_half_day')}
                  className=\"mr-2\"
                />
                <span className=\"text-sm text-gray-700\">Half Day Leave</span>
              </label>
            </div>

            {watch('is_half_day') && (
              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-1\">
                  Half Day Session
                </label>
                <select
                  {...register('half_day_session')}
                  className=\"w-full border border-gray-300 rounded-md px-3 py-2\"
                >
                  <option value=\"FIRST_HALF\">First Half</option>
                  <option value=\"SECOND_HALF\">Second Half</option>
                </select>
              </div>
            )}

            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-1\">
                Reason *
              </label>
              <textarea
                {...register('reason', { required: 'Reason is required' })}
                rows={3}
                className=\"w-full border border-gray-300 rounded-md px-3 py-2\"
                placeholder=\"Reason for leave\"
              />
              {errors.reason && (
                <p className=\"text-red-500 text-sm mt-1\">{errors.reason.message}</p>
              )}
            </div>

            <div>
              <label className=\"block text-sm font-medium text-gray-700 mb-1\">
                Address During Leave
              </label>
              <textarea
                {...register('address_during_leave')}
                rows={2}
                className=\"w-full border border-gray-300 rounded-md px-3 py-2\"
                placeholder=\"Address where you can be contacted\"
              />
            </div>

            <button
              type=\"submit\"
              disabled={loading}
              className=\"bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50\"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      )}

      {/* Leave History Tab */}
      {activeTab === 'history' && (
        <div className=\"bg-white rounded-lg shadow overflow-hidden\">
          <div className=\"px-6 py-4 border-b border-gray-200\">
            <h2 className=\"text-lg font-semibold\">Leave History</h2>
          </div>
          <div className=\"overflow-x-auto\">
            <table className=\"min-w-full divide-y divide-gray-200\">
              <thead className=\"bg-gray-50\">
                <tr>
                  <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase\">
                    Leave Type
                  </th>
                  <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase\">
                    Duration
                  </th>
                  <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase\">
                    Days
                  </th>
                  <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase\">
                    Status
                  </th>
                  <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase\">
                    Applied On
                  </th>
                  <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase\">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className=\"bg-white divide-y divide-gray-200\">
                {leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td className=\"px-6 py-4 whitespace-nowrap text-sm text-gray-900\">
                      {leave.leave_type_id?.name}
                    </td>
                    <td className=\"px-6 py-4 whitespace-nowrap text-sm text-gray-900\">
                      {new Date(leave.from_date).toLocaleDateString()} - {new Date(leave.to_date).toLocaleDateString()}
                    </td>
                    <td className=\"px-6 py-4 whitespace-nowrap text-sm text-gray-900\">
                      {leave.total_days}
                    </td>
                    <td className=\"px-6 py-4 whitespace-nowrap\">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className=\"px-6 py-4 whitespace-nowrap text-sm text-gray-900\">
                      {new Date(leave.applied_at).toLocaleDateString()}
                    </td>
                    <td className=\"px-6 py-4 whitespace-nowrap text-sm font-medium\">
                      {(leave.status === 'PENDING' || leave.status === 'APPROVED') && (
                        <button
                          onClick={() => cancelLeave(leave._id)}
                          className=\"text-red-600 hover:text-red-900\"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leave Balance Tab */}
      {activeTab === 'balance' && (
        <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">
          {leaveBalance.map((balance) => (
            <div key={balance._id} className=\"bg-white rounded-lg shadow p-6\">
              <h3 className=\"text-lg font-semibold text-gray-900 mb-4\">
                {balance.leave_type_id?.name}
              </h3>
              <div className=\"space-y-2\">
                <div className=\"flex justify-between\">
                  <span className=\"text-gray-600\">Allocated:</span>
                  <span className=\"font-medium\">{balance.allocated}</span>
                </div>
                <div className=\"flex justify-between\">
                  <span className=\"text-gray-600\">Used:</span>
                  <span className=\"font-medium text-red-600\">{balance.used}</span>
                </div>
                <div className=\"flex justify-between\">
                  <span className=\"text-gray-600\">Pending:</span>
                  <span className=\"font-medium text-yellow-600\">{balance.pending}</span>
                </div>
                <div className=\"flex justify-between border-t pt-2\">
                  <span className=\"text-gray-900 font-semibold\">Available:</span>
                  <span className=\"font-bold text-green-600\">{balance.available_balance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeLeave;