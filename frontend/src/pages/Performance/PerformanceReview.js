import React, { useState } from 'react';

const PerformanceReview = () => {
  const [activeTab, setActiveTab] = useState('my-reviews');

  const reviews = [
    {
      id: 1,
      period: 'Q4 2023',
      reviewer: 'Jane Smith',
      status: 'COMPLETED',
      rating: 4.2,
      completedAt: '2024-01-15'
    },
    {
      id: 2,
      period: 'Q3 2023',
      reviewer: 'Mike Johnson',
      status: 'PENDING',
      rating: null,
      dueDate: '2024-01-30'
    }
  ];

  const goals = [
    { id: 1, title: 'Complete React Training', progress: 80, dueDate: '2024-02-15', status: 'IN_PROGRESS' },
    { id: 2, title: 'Lead Team Project', progress: 100, dueDate: '2024-01-20', status: 'COMPLETED' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Performance Management</h1>
        <p className="text-gray-600">Track your performance reviews and goals</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'my-reviews', name: 'My Reviews' },
              { id: 'goals', name: 'Goals & Objectives' },
              { id: 'feedback', name: 'Feedback' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'my-reviews' && (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{review.period} Performance Review</h3>
                      <p className="text-sm text-gray-500">Reviewer: {review.reviewer}</p>
                      {review.rating && (
                        <div className="flex items-center mt-2">
                          <span className="text-2xl font-bold text-blue-600">{review.rating}</span>
                          <span className="text-gray-500 ml-2">/ 5.0</span>
                        </div>
                      )}
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      review.status === 'COMPLETED' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {review.status}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    {review.status === 'COMPLETED' ? (
                      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        View Details
                      </button>
                    ) : (
                      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Complete Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{goal.title}</h3>
                      <p className="text-sm text-gray-500">Due: {new Date(goal.dueDate).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      goal.status === 'COMPLETED' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {goal.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200">
                    Update Progress
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">💬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback available</h3>
              <p className="text-gray-500">Feedback from peers and managers will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceReview;