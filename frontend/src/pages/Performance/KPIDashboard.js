import React from 'react';

const KPIDashboard = () => {
  const kpis = [
    { name: 'Project Completion Rate', current: 85, target: 90, unit: '%' },
    { name: 'Code Quality Score', current: 4.2, target: 4.5, unit: '/5' },
    { name: 'Team Collaboration', current: 88, target: 85, unit: '%' },
    { name: 'Learning Goals', current: 3, target: 4, unit: 'courses' }
  ];

  const getProgressColor = (current, target) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 80) return 'bg-blue-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">KPI Dashboard</h1>
        <p className="text-gray-600">Track your key performance indicators</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">{kpi.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                kpi.current >= kpi.target 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {kpi.current >= kpi.target ? 'On Track' : 'Needs Attention'}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Current: {kpi.current}{kpi.unit}</span>
                <span>Target: {kpi.target}{kpi.unit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${getProgressColor(kpi.current, kpi.target)}`}
                  style={{ width: `${Math.min((kpi.current / kpi.target) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              Progress: {((kpi.current / kpi.target) * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Trends</h3>
        <div className="text-center py-12 text-gray-500">
          📈 Performance charts will be displayed here
        </div>
      </div>
    </div>
  );
};

export default KPIDashboard;