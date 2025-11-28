import React, { useState } from 'react';
import { toast } from 'react-toastify';

const SubscriptionManagement = () => {
  const [currentPlan] = useState({
    name: 'MEDIUM',
    title: 'Growth Plan',
    price: 2999,
    billing: 'MONTHLY',
    status: 'ACTIVE',
    nextBilling: '2024-02-15',
    employees: { used: 45, limit: 150 },
    storage: { used: 2.5, limit: 10 }
  });

  const plans = [
    {
      name: 'BASIC',
      title: 'Starter',
      price: 999,
      features: ['30 employees', 'Basic attendance', 'Leave management', '1GB storage'],
      popular: false
    },
    {
      name: 'MEDIUM',
      title: 'Growth',
      price: 2999,
      features: ['150 employees', 'Payroll management', 'Performance tracking', '10GB storage'],
      popular: true
    },
    {
      name: 'GOLD',
      title: 'Enterprise',
      price: 5999,
      features: ['Unlimited employees', 'All features', 'Face recognition', 'Unlimited storage'],
      popular: false
    }
  ];

  const billingHistory = [
    { date: '2024-01-15', amount: 2999, plan: 'MEDIUM', status: 'PAID' },
    { date: '2023-12-15', amount: 2999, plan: 'MEDIUM', status: 'PAID' },
    { date: '2023-11-15', amount: 999, plan: 'BASIC', status: 'PAID' }
  ];

  const upgradePlan = (planName) => {
    toast.success(`Plan upgrade to ${planName} initiated!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
        <p className="text-gray-600">Manage your subscription plan and billing</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Current Plan</h3>
            <div className="mt-2">
              <span className="text-2xl font-bold text-blue-600">{currentPlan.title}</span>
              <span className="ml-2 text-gray-500">₹{currentPlan.price}/month</span>
            </div>
            <div className="mt-2 flex items-center">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                currentPlan.status === 'ACTIVE' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {currentPlan.status}
              </span>
              <span className="ml-3 text-sm text-gray-500">
                Next billing: {new Date(currentPlan.nextBilling).toLocaleDateString()}
              </span>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Manage Billing
          </button>
        </div>

        {/* Usage Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Employees</span>
              <span>{currentPlan.employees.used} / {currentPlan.employees.limit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(currentPlan.employees.used / currentPlan.employees.limit) * 100}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Storage</span>
              <span>{currentPlan.storage.used}GB / {currentPlan.storage.limit}GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${(currentPlan.storage.used / currentPlan.storage.limit) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`border rounded-lg p-6 ${
                currentPlan.name === plan.name
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300'
              } ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
            >
              {plan.popular && (
                <div className="text-center mb-4">
                  <span className="bg-blue-500 text-white px-3 py-1 text-xs rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">{plan.title}</h4>
                <div className="text-3xl font-bold text-blue-600 mt-2">₹{plan.price}</div>
                <div className="text-sm text-gray-500">per month</div>
              </div>
              
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              {currentPlan.name === plan.name ? (
                <button className="w-full bg-gray-100 text-gray-500 py-2 rounded-md cursor-not-allowed">
                  Current Plan
                </button>
              ) : (
                <button
                  onClick={() => upgradePlan(plan.name)}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  {plans.findIndex(p => p.name === currentPlan.name) > plans.findIndex(p => p.name === plan.name) 
                    ? 'Downgrade' : 'Upgrade'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Billing History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {billingHistory.map((bill, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(bill.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bill.plan}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{bill.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {bill.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">Download Invoice</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagement;