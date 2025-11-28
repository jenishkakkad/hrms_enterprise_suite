import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AttendancePortal = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleAttendance = async (type) => {
    try {
      const attendanceData = {
        type,
        timestamp: new Date(),
        location,
        method: 'WEB'
      };

      // API call would go here
      console.log('Attendance marked:', attendanceData);
      
      if (type === 'IN') {
        setIsCheckedIn(true);
        setTodayAttendance({
          ...todayAttendance,
          checkIn: currentTime,
          status: 'PRESENT'
        });
        toast.success('Checked in successfully!');
      } else {
        setIsCheckedIn(false);
        setTodayAttendance({
          ...todayAttendance,
          checkOut: currentTime,
          totalHours: calculateHours(todayAttendance?.checkIn, currentTime)
        });
        toast.success('Checked out successfully!');
      }
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const diff = checkOut - checkIn;
    return (diff / (1000 * 60 * 60)).toFixed(2);
  };

  const recentAttendance = [
    { date: '2024-01-15', checkIn: '09:15', checkOut: '18:30', hours: '9.25', status: 'PRESENT' },
    { date: '2024-01-14', checkIn: '09:00', checkOut: '18:15', hours: '9.25', status: 'PRESENT' },
    { date: '2024-01-13', checkIn: '09:30', checkOut: '18:45', hours: '9.25', status: 'LATE' },
    { date: '2024-01-12', checkIn: '09:10', checkOut: '18:20', hours: '9.17', status: 'PRESENT' },
    { date: '2024-01-11', checkIn: '-', checkOut: '-', hours: '0', status: 'ABSENT' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-100 text-green-800';
      case 'LATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ABSENT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Portal</h1>
        <p className="text-gray-600">Mark your daily attendance and view your records</p>
      </div>

      {/* Current Time & Attendance */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-xl mb-6">
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleAttendance('IN')}
              disabled={isCheckedIn}
              className={`px-8 py-4 rounded-lg font-medium text-lg transition-all ${
                isCheckedIn
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 transform hover:scale-105'
              }`}
            >
              🟢 Check In
            </button>
            
            <button
              onClick={() => handleAttendance('OUT')}
              disabled={!isCheckedIn}
              className={`px-8 py-4 rounded-lg font-medium text-lg transition-all ${
                !isCheckedIn
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 transform hover:scale-105'
              }`}
            >
              🔴 Check Out
            </button>
          </div>
          
          {location && (
            <p className="mt-4 text-sm text-blue-100">
              📍 Location detected: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </p>
          )}
        </div>
      </div>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              🕐
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Check In</p>
              <p className="text-lg font-bold text-gray-900">
                {todayAttendance?.checkIn ? todayAttendance.checkIn.toLocaleTimeString() : '--:--'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              🕐
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Check Out</p>
              <p className="text-lg font-bold text-gray-900">
                {todayAttendance?.checkOut ? todayAttendance.checkOut.toLocaleTimeString() : '--:--'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              ⏱️
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Hours</p>
              <p className="text-lg font-bold text-gray-900">
                {todayAttendance?.totalHours || '0.00'} hrs
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              📊
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="text-lg font-bold text-gray-900">
                {todayAttendance?.status || 'Not Marked'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Attendance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentAttendance.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.checkIn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.checkOut}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.hours} hrs
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium">View Reports</div>
            </div>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">📝</div>
              <div className="text-sm font-medium">Request Correction</div>
            </div>
          </button>
          
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <div className="text-center">
              <div className="text-2xl mb-2">📅</div>
              <div className="text-sm font-medium">View Calendar</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendancePortal;