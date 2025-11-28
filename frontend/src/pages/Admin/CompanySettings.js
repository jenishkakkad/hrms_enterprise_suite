import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const CompanySettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log('Settings updated:', data);
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings');
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'attendance', name: 'Attendance', icon: '⏰' },
    { id: 'leave', name: 'Leave Policy', icon: '🏖️' },
    { id: 'payroll', name: 'Payroll', icon: '💰' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
          <input
            {...register('company_name')}
            type="text"
            defaultValue="Tech Corp Ltd"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
          <select {...register('industry')} className="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Finance">Finance</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
          <select {...register('timezone')} className="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/London">Europe/London</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select {...register('currency')} className="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderAttendanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Grace Period (minutes)</label>
          <input
            {...register('grace_period')}
            type="number"
            defaultValue="15"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours per Day</label>
          <input
            {...register('working_hours')}
            type="number"
            defaultValue="8"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
        <div className="grid grid-cols-7 gap-2">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
            <label key={day} className="flex items-center">
              <input
                type="checkbox"
                defaultChecked={!['Saturday', 'Sunday'].includes(day)}
                className="mr-2"
              />
              <span className="text-sm">{day.slice(0, 3)}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
        <p className="text-gray-600">Manage your company configuration and policies</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'attendance' && renderAttendanceSettings()}
          {activeTab === 'leave' && (
            <div className="text-center py-12 text-gray-500">
              Leave policy settings will be configured here
            </div>
          )}
          {activeTab === 'payroll' && (
            <div className="text-center py-12 text-gray-500">
              Payroll settings will be configured here
            </div>
          )}
          {activeTab === 'notifications' && (
            <div className="text-center py-12 text-gray-500">
              Notification preferences will be configured here
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanySettings;