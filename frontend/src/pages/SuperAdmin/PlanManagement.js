import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const PlanManagement = () => {
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: 'BASIC',
      title: 'Starter Plan',
      price: 999,
      currency: 'INR',
      billing: 'MONTHLY',
      limits: { employees: 30, storage: 1, hr_users: 1 },
      features: { payroll: false, performance: false, geo_attendance: false },
      active: true,
      companies: 78
    },
    {
      id: 2,
      name: 'MEDIUM',
      title: 'Growth Plan',
      price: 2999,
      currency: 'INR',
      billing: 'MONTHLY',
      limits: { employees: 150, storage: 10, hr_users: 3 },
      features: { payroll: true, performance: true, geo_attendance: false },
      active: true,
      companies: 54
    },
    {
      id: 3,
      name: 'GOLD',
      title: 'Enterprise Plan',
      price: 5999,
      currency: 'INR',
      billing: 'MONTHLY',
      limits: { employees: -1, storage: -1, hr_users: -1 },
      features: { payroll: true, performance: true, geo_attendance: true },
      active: true,
      companies: 24
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      if (editingPlan) {
        setPlans(plans.map(plan => 
          plan.id === editingPlan.id 
            ? { ...plan, ...data, limits: JSON.parse(data.limits), features: JSON.parse(data.features) }
            : plan
        ));
        toast.success('Plan updated successfully!');
        setEditingPlan(null);
      } else {
        const newPlan = {
          id: Date.now(),
          ...data,
          limits: JSON.parse(data.limits),
          features: JSON.parse(data.features),
          companies: 0
        };
        setPlans([...plans, newPlan]);
        toast.success('Plan created successfully!');
      }
      setShowCreateForm(false);
      reset();
    } catch (error) {
      toast.error('Failed to save plan');
    }
  };

  const togglePlanStatus = (planId) => {
    setPlans(plans.map(plan => 
      plan.id === planId ? { ...plan, active: !plan.active } : plan
    ));
    toast.success('Plan status updated!');
  };

  const editPlan = (plan) => {
    setEditingPlan(plan);
    setShowCreateForm(true);
    reset({
      ...plan,
      limits: JSON.stringify(plan.limits),
      features: JSON.stringify(plan.features)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plan Management</h1>
          <p className="text-gray-600">Manage subscription plans and pricing</p>
        </div>
        <button
          onClick={() => {
            setEditingPlan(null);
            setShowCreateForm(true);
            reset();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`border rounded-lg p-6 ${
              plan.active ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{plan.title}</h3>
                <p className="text-sm text-gray-500">{plan.name}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                plan.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {plan.active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-blue-600">
                ₹{plan.price.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">per month</div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-sm">
                <strong>Limits:</strong>
                <ul className="ml-4 text-gray-600">
                  <li>• Employees: {plan.limits.employees === -1 ? 'Unlimited' : plan.limits.employees}</li>
                  <li>• Storage: {plan.limits.storage === -1 ? 'Unlimited' : `${plan.limits.storage}GB`}</li>
                  <li>• HR Users: {plan.limits.hr_users === -1 ? 'Unlimited' : plan.limits.hr_users}</li>
                </ul>
              </div>
              
              <div className="text-sm">
                <strong>Features:</strong>
                <ul className="ml-4 text-gray-600">
                  <li>• Payroll: {plan.features.payroll ? '✅' : '❌'}</li>
                  <li>• Performance: {plan.features.performance ? '✅' : '❌'}</li>
                  <li>• Geo Attendance: {plan.features.geo_attendance ? '✅' : '❌'}</li>
                </ul>
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="text-lg font-medium text-gray-900">{plan.companies}</div>
              <div className="text-sm text-gray-500">Active Companies</div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => editPlan(plan)}
                className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200"
              >
                Edit
              </button>
              <button
                onClick={() => togglePlanStatus(plan.id)}
                className={`flex-1 px-3 py-2 rounded text-sm ${
                  plan.active
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {plan.active ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Plan Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{plans.length}</div>
            <div className="text-sm text-gray-500">Total Plans</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {plans.filter(p => p.active).length}
            </div>
            <div className="text-sm text-gray-500">Active Plans</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {plans.reduce((sum, p) => sum + p.companies, 0)}
            </div>
            <div className="text-sm text-gray-500">Total Subscriptions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              ₹{plans.reduce((sum, p) => sum + (p.price * p.companies), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Monthly Revenue</div>
          </div>
        </div>
      </div>

      {/* Create/Edit Plan Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingPlan ? 'Edit Plan' : 'Create New Plan'}
              </h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name</label>
                  <input
                    {...register('name', { required: 'Plan name is required' })}
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., PREMIUM"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plan Title</label>
                  <input
                    {...register('title', { required: 'Plan title is required' })}
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., Premium Plan"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    {...register('price', { required: 'Price is required', min: 0 })}
                    type="number"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="999"
                  />
                  {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    {...register('currency')}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Limits (JSON format)
                </label>
                <textarea
                  {...register('limits', { required: 'Limits are required' })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder='{"employees": 100, "storage": 5, "hr_users": 2}'
                />
                {errors.limits && <p className="mt-1 text-sm text-red-600">{errors.limits.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features (JSON format)
                </label>
                <textarea
                  {...register('features', { required: 'Features are required' })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder='{"payroll": true, "performance": false, "geo_attendance": false}'
                />
                {errors.features && <p className="mt-1 text-sm text-red-600">{errors.features.message}</p>}
              </div>

              <div className="flex items-center">
                <input
                  {...register('active')}
                  type="checkbox"
                  defaultChecked={true}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Active Plan
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanManagement;