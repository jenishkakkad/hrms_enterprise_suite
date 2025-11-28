import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

const EmployeeDashboard = () => {
  const { user, company } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAttendance = () => {
    setIsCheckedIn(!isCheckedIn);
    // TODO: Implement actual attendance API call
  };

  const stats = [
    {
      title: 'Present Days',
      value: '22',
      subtitle: 'This month',
      icon: '✅',
      color: 'bg-green-500'
    },
    {
      title: 'Leave Balance',
      value: '8',
      subtitle: 'Days remaining',
      icon: '🏖️',
      color: 'bg-blue-500'
    },
    {
      title: 'Pending Tasks',
      value: '5',
      subtitle: 'Due this week',
      icon: '📋',
      color: 'bg-orange-500'
    },
    {
      title: 'This Month Salary',
      value: '₹45,000',
      subtitle: 'Gross amount',
      icon: '💰',
      color: 'bg-purple-500'
    }
  ];

  const recentActivities = [
    {
      type: 'attendance',
      message: 'Checked in at 9:15 AM',
      time: '2 hours ago',
      icon: '⏰'
    },
    {
      type: 'leave',
      message: 'Leave application approved',
      time: '1 day ago',
      icon: '✅'
    },
    {
      type: 'task',
      message: 'Task "Project Review" completed',
      time: '2 days ago',
      icon: '✅'
    },
    {
      type: 'payroll',
      message: 'Salary slip generated for October',
      time: '3 days ago',
      icon: '💰'
    }
  ];

  const upcomingEvents = [
    {
      title: 'Team Meeting',
      date: 'Today, 2:00 PM',
      type: 'meeting'
    },
    {
      title: 'Project Deadline',
      date: 'Tomorrow',
      type: 'deadline'
    },
    {
      title: 'Company Holiday',
      date: 'Nov 15, 2024',
      type: 'holiday'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Attendance */}
          <div className="text-center">
            <button
              onClick={handleAttendance}
              className={`w-full p-4 rounded-lg border-2 border-dashed transition-colors ${
                isCheckedIn
                  ? 'border-red-300 bg-red-50 hover:bg-red-100'
                  : 'border-green-300 bg-green-50 hover:bg-green-100'
              }`}
            >
              <div className="text-2xl mb-2">
                {isCheckedIn ? '🔴' : '🟢'}
              </div>
              <div className="text-sm font-medium">
                {isCheckedIn ? 'Check Out' : 'Check In'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {currentTime.toLocaleTimeString()}
              </div>
            </button>
          </div>

          {/* Apply Leave */}
          <div className="text-center">
            <button className="w-full p-4 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 transition-colors">
              <div className="text-2xl mb-2">🏖️</div>
              <div className="text-sm font-medium">Apply Leave</div>
              <div className="text-xs text-gray-500 mt-1">Quick application</div>
            </button>
          </div>

          {/* View Payslip */}
          <div className="text-center">
            <button className="w-full p-4 rounded-lg border-2 border-dashed border-purple-300 bg-purple-50 hover:bg-purple-100 transition-colors">
              <div className="text-2xl mb-2">💰</div>
              <div className="text-sm font-medium">View Payslip</div>
              <div className="text-xs text-gray-500 mt-1">Current month</div>
            </button>
          </div>

          {/* Submit Expense */}
          <div className="text-center">
            <button className="w-full p-4 rounded-lg border-2 border-dashed border-orange-300 bg-orange-50 hover:bg-orange-100 transition-colors">
              <div className="text-2xl mb-2">🧾</div>
              <div className="text-sm font-medium">Submit Expense</div>
              <div className="text-xs text-gray-500 mt-1">Reimbursement</div>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color} text-white text-xl`}>
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-xs text-gray-500">{stat.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="text-lg">{activity.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.date}</p>
                  </div>
                  <div className="text-lg">
                    {event.type === 'meeting' && '👥'}
                    {event.type === 'deadline' && '⏰'}
                    {event.type === 'holiday' && '🎉'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Today's Schedule</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border-l-4 border-blue-500 bg-blue-50">
              <div>
                <p className="text-sm font-medium text-gray-900">Daily Standup</p>
                <p className="text-xs text-gray-500">9:30 AM - 10:00 AM</p>
              </div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Upcoming</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border-l-4 border-green-500 bg-green-50">
              <div>
                <p className="text-sm font-medium text-gray-900">Project Review</p>
                <p className="text-xs text-gray-500">2:00 PM - 3:00 PM</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Scheduled</span>
            </div>
            
            <div className="flex items-center justify-between p-3 border-l-4 border-orange-500 bg-orange-50">
              <div>
                <p className="text-sm font-medium text-gray-900">Client Call</p>
                <p className="text-xs text-gray-500">4:30 PM - 5:30 PM</p>
              </div>
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Important</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;