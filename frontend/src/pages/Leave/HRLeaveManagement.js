import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';

const HRLeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState('');
  const [comments, setComments] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    employee_id: ''
  });
  const { user } = useAuthStore();

  useEffect(() => {
    fetchLeaves();
  }, [filters]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.employee_id) params.append('employee_id', filters.employee_id);
      
      const response = await axios.get(`/leaves/all?${params}`);
      setLeaves(response.data.data.leaves);
    } catch (error) {
      toast.error('Error fetching leave applications');
    }
    setLoading(false);
  };

  const handleApproveReject = async () => {
    if (!comments.trim()) {
      toast.error('Please add comments');
      return;
    }

    try {
      await axios.put(`/leaves/approve-reject/${selectedLeave._id}`, {
        action,
        comments
      });
      
      toast.success(`Leave ${action.toLowerCase()}d successfully`);
      setShowModal(false);
      setComments('');
      setSelectedLeave(null);
      fetchLeaves();
    } catch (error) {
      toast.error(`Error ${action.toLowerCase()}ing leave`);
    }
  };

  const openModal = (leave, actionType) => {
    setSelectedLeave(leave);
    setAction(actionType);
    setShowModal(true);
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

  const getPriorityColor = (days) => {
    if (days >= 7) return 'text-red-600'; // Long leave
    if (days >= 3) return 'text-yellow-600'; // Medium leave
    return 'text-green-600'; // Short leave
  };

  return (
    <div className=\"p-6\">
      <div className=\"mb-6\">
        <h1 className=\"text-2xl font-bold text-gray-900\">Leave Management</h1>
        <p className=\"text-gray-600\">Review and approve employee leave applications</p>
      </div>

      {/* Filters */}
      <div className=\"bg-white rounded-lg shadow p-4 mb-6\">
        <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">
          <div>
            <label className=\"block text-sm font-medium text-gray-700 mb-1\">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className=\"w-full border border-gray-300 rounded-md px-3 py-2\"
            >
              <option value=\"\">All Status</option>
              <option value=\"PENDING\">Pending</option>
              <option value=\"APPROVED\">Approved</option>
              <option value=\"REJECTED\">Rejected</option>
              <option value=\"CANCELLED\">Cancelled</option>
            </select>
          </div>
          
          <div className=\"flex items-end\">
            <button
              onClick={() => setFilters({ status: '', employee_id: '' })}
              className=\"bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600\"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Leave Applications Table */}
      <div className=\"bg-white rounded-lg shadow overflow-hidden\">
        <div className=\"px-6 py-4 border-b border-gray-200 flex justify-between items-center\">
          <h2 className=\"text-lg font-semibold\">Leave Applications</h2>
          <div className=\"flex space-x-2\">
            <span className=\"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800\">
              Pending: {leaves.filter(l => l.status === 'PENDING').length}
            </span>
            <span className=\"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800\">
              Approved: {leaves.filter(l => l.status === 'APPROVED').length}
            </span>
          </div>
        </div>
        
        {loading ? (
          <div className=\"p-8 text-center\">
            <div className=\"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto\"></div>
            <p className=\"mt-2 text-gray-600\">Loading leave applications...</p>
          </div>
        ) : (
          <div className=\"overflow-x-auto\">
            <table className=\"min-w-full divide-y divide-gray-200\">
              <thead className=\"bg-gray-50\">
                <tr>
                  <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase\">
                    Employee
                  </th>
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
                    Reason
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
                  <tr key={leave._id} className=\"hover:bg-gray-50\">
                    <td className=\"px-6 py-4 whitespace-nowrap\">
                      <div className=\"flex items-center\">
                        <div>
                          <div className=\"text-sm font-medium text-gray-900\">
                            {leave.employee_id?.first_name} {leave.employee_id?.last_name}
                          </div>
                          <div className=\"text-sm text-gray-500\">
                            {leave.employee_id?.employee_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className=\"px-6 py-4 whitespace-nowrap text-sm text-gray-900\">
                      {leave.leave_type_id?.name}
                    </td>
                    <td className=\"px-6 py-4 whitespace-nowrap text-sm text-gray-900\">
                      <div>
                        {new Date(leave.from_date).toLocaleDateString()}
                      </div>
                      <div className=\"text-xs text-gray-500\">
                        to {new Date(leave.to_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className=\"px-6 py-4 whitespace-nowrap\">
                      <span className={`text-sm font-medium ${getPriorityColor(leave.total_days)}`}>
                        {leave.total_days} {leave.is_half_day ? '(Half Day)' : 'days'}
                      </span>
                    </td>
                    <td className=\"px-6 py-4 text-sm text-gray-900 max-w-xs truncate\">
                      {leave.reason}
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
                      {leave.status === 'PENDING' && (
                        <div className=\"flex space-x-2\">
                          <button
                            onClick={() => openModal(leave, 'APPROVE')}
                            className=\"text-green-600 hover:text-green-900\"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openModal(leave, 'REJECT')}
                            className=\"text-red-600 hover:text-red-900\"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {leave.status !== 'PENDING' && (
                        <span className=\"text-gray-400\">
                          {leave.status === 'APPROVED' ? 'Approved' : 
                           leave.status === 'REJECTED' ? 'Rejected' : 'Cancelled'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {leaves.length === 0 && (
              <div className=\"p-8 text-center text-gray-500\">
                No leave applications found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Approval/Rejection Modal */}
      {showModal && (
        <div className=\"fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50\">
          <div className=\"relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white\">
            <div className=\"mt-3\">
              <h3 className=\"text-lg font-medium text-gray-900 mb-4\">
                {action} Leave Application
              </h3>
              
              {selectedLeave && (
                <div className=\"mb-4 p-3 bg-gray-50 rounded\">
                  <p><strong>Employee:</strong> {selectedLeave.employee_id?.first_name} {selectedLeave.employee_id?.last_name}</p>
                  <p><strong>Leave Type:</strong> {selectedLeave.leave_type_id?.name}</p>
                  <p><strong>Duration:</strong> {new Date(selectedLeave.from_date).toLocaleDateString()} - {new Date(selectedLeave.to_date).toLocaleDateString()}</p>
                  <p><strong>Days:</strong> {selectedLeave.total_days}</p>
                  <p><strong>Reason:</strong> {selectedLeave.reason}</p>
                </div>
              )}
              
              <div className=\"mb-4\">
                <label className=\"block text-sm font-medium text-gray-700 mb-2\">
                  Comments *
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                  className=\"w-full border border-gray-300 rounded-md px-3 py-2\"
                  placeholder={`Add comments for ${action.toLowerCase()}ing this leave...`}
                />
              </div>
              
              <div className=\"flex justify-end space-x-3\">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setComments('');
                    setSelectedLeave(null);
                  }}
                  className=\"px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400\"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApproveReject}
                  className={`px-4 py-2 rounded-md text-white ${
                    action === 'APPROVE' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {action === 'APPROVE' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRLeaveManagement;