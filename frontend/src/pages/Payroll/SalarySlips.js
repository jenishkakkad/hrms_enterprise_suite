import React, { useState } from 'react';

const SalarySlips = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const salarySlips = [
    { month: 'January 2024', gross: 75000, deductions: 15000, net: 60000, status: 'GENERATED' },
    { month: 'December 2023', gross: 75000, deductions: 15000, net: 60000, status: 'GENERATED' },
    { month: 'November 2023', gross: 75000, deductions: 15000, net: 60000, status: 'GENERATED' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Salary Slips</h1>
        <p className="text-gray-600">View and download your salary slips</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value={2024}>2024</option>
              <option value={2023}>2023</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {salarySlips.map((slip, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">{slip.month}</h3>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                {slip.status}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Gross Salary:</span>
                <span className="font-medium">₹{slip.gross.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Deductions:</span>
                <span className="font-medium text-red-600">₹{slip.deductions.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-medium">Net Salary:</span>
                <span className="font-bold text-green-600">₹{slip.net.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
                View
              </button>
              <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700">
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalarySlips;