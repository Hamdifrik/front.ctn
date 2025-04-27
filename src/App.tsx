import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CustomerDashboard from './pages/customer/Dashboard';
import ShipmentTracking from './pages/customer/ShipmentTracking';




import AdminDashboard from './pages/admin/AdminDashboard';

import NotFound from './pages/NotFound';
import BookingForm from './pages/customer/BookingForm';
import UserManagement from './pages/customer/UserManagement';
import ClaimManagement from './pages/customer/ClaimManagement';
import ShipmentHistory from './pages/customer/ShipmentHistory';
import Dashboard from './pages/agent/Dashboard';
import FileManagement from './pages/agent/FileManagement';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<Layout />}>
              {/* Customer Routes */}
              <Route path="" element={<Navigate to="/customer/dashboard" replace />} />
              <Route 
                path="customer/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="customer/tracking/:id?" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <ShipmentTracking />
                  </ProtectedRoute>
                } 
              />
            
              <Route 
                path="customer/claims" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <ClaimManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="customer/history" 
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <ShipmentHistory />
                  </ProtectedRoute>
                } 
              />
              
              {/* Agent Routes */}
              <Route 
                path="agent/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['agent']}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="agent/files" 
                element={
                  <ProtectedRoute allowedRoles={['agent']}>
                    <FileManagement />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="admin/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/users" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                } 
              />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;