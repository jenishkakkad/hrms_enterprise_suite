import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuthStore } from './store/authStore';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import RoleBasedRoute from './components/Auth/RoleBasedRoute';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Dashboard Pages
import Dashboard from './pages/Dashboard/Dashboard';

// Employee Pages
import EmployeeList from './pages/Employee/EmployeeList';
import EmployeeProfile from './pages/Employee/EmployeeProfile';
import AddEmployee from './pages/Employee/AddEmployee';

// Attendance Pages
import AttendancePortal from './pages/Attendance/AttendancePortal';
import AttendanceReports from './pages/Attendance/AttendanceReports';

// Leave Pages
import LeaveApplication from './pages/Leave/LeaveApplication';
import LeaveApproval from './pages/Leave/LeaveApproval';
import LeaveReports from './pages/Leave/LeaveReports';

// Payroll Pages
import PayrollDashboard from './pages/Payroll/PayrollDashboard';
import SalarySlips from './pages/Payroll/SalarySlips';

// Performance Pages
import PerformanceReview from './pages/Performance/PerformanceReview';
import KPIDashboard from './pages/Performance/KPIDashboard';

// Task Pages
import TaskManagement from './pages/Tasks/TaskManagement';

// Admin Pages
import CompanySettings from './pages/Admin/CompanySettings';
import UserManagement from './pages/Admin/UserManagement';
import SubscriptionManagement from './pages/Admin/SubscriptionManagement';

// Super Admin Pages
import SuperAdminDashboard from './pages/SuperAdmin/SuperAdminDashboard';
import CompanyManagement from './pages/SuperAdmin/CompanyManagement';
import PlanManagement from './pages/SuperAdmin/PlanManagement';

import './App.css';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} 
          />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" />} />
            
            {/* Dashboard */}
            <Route path="dashboard" element={<Dashboard />} />

            {/* Employee Management */}
            <Route path="employees">
              <Route index element={<EmployeeList />} />
              <Route path="add" element={
                <RoleBasedRoute allowedRoles={['COMPANY_ADMIN', 'HR_MANAGER']}>
                  <AddEmployee />
                </RoleBasedRoute>
              } />
              <Route path=":id" element={<EmployeeProfile />} />
            </Route>

            {/* Attendance */}
            <Route path="attendance">
              <Route index element={<AttendancePortal />} />
              <Route path="reports" element={
                <RoleBasedRoute allowedRoles={['COMPANY_ADMIN', 'HR_MANAGER', 'TEAM_LEAD']}>
                  <AttendanceReports />
                </RoleBasedRoute>
              } />
            </Route>

            {/* Leave Management */}
            <Route path="leaves">
              <Route index element={<LeaveApplication />} />
              <Route path="approvals" element={
                <RoleBasedRoute allowedRoles={['COMPANY_ADMIN', 'HR_MANAGER', 'TEAM_LEAD']}>
                  <LeaveApproval />
                </RoleBasedRoute>
              } />
              <Route path="reports" element={
                <RoleBasedRoute allowedRoles={['COMPANY_ADMIN', 'HR_MANAGER']}>
                  <LeaveReports />
                </RoleBasedRoute>
              } />
            </Route>

            {/* Payroll */}
            <Route path="payroll">
              <Route index element={<PayrollDashboard />} />
              <Route path="salary-slips" element={<SalarySlips />} />
            </Route>

            {/* Performance */}
            <Route path="performance">
              <Route index element={<PerformanceReview />} />
              <Route path="kpi" element={<KPIDashboard />} />
            </Route>

            {/* Tasks */}
            <Route path="tasks" element={<TaskManagement />} />

            {/* Admin Routes */}
            <Route path="admin" element={
              <RoleBasedRoute allowedRoles={['COMPANY_ADMIN']}>
                <div />
              </RoleBasedRoute>
            }>
              <Route path="settings" element={<CompanySettings />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="subscription" element={<SubscriptionManagement />} />
            </Route>

            {/* Super Admin Routes */}
            <Route path="super-admin" element={
              <RoleBasedRoute allowedRoles={['SUPER_ADMIN']}>
                <div />
              </RoleBasedRoute>
            }>
              <Route index element={<SuperAdminDashboard />} />
              <Route path="companies" element={<CompanyManagement />} />
              <Route path="plans" element={<PlanManagement />} />
            </Route>
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;