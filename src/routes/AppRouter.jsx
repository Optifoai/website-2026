import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './hooks/useAuth';
// import MainLayout from '../components/layout/MainLayout';
// import LoginPage from '../features/auth/pages/LoginPage';
// import SignupPage from '../features/auth/pages/SignupPage';
// import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
// import DashboardPage from '../features/dashboard/pages/DashboardPage';
// import PrivateRoute from './PrivateRoute';

// Import Pages
import LoginPage from '../pages/Auth/LoginPage';
import SignupPage from '../pages/Auth/SignupPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import ProfilePage from '../pages/Dashboard/ProfilePage';
import NotFoundPage from '../pages/NotFoundPage';

import PrivateRoute from './PrivateRoute';

// Layout Components (optional, for consistent structure)
import Header from '../components/layout/Header/Header';
import Footer from '../components/layout/Footer/Footer';

export default function AppRouter() {
  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center' }}>
      <Header /> {/* Optional: Add a header */}
      <main style={{ flex: 1, width: '100%', maxWidth: '1200px', padding: '1rem' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* Redirect to dashboard if logged in, otherwise to login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Not Found Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer /> {/* Optional: Add a footer */}
    </div>
  );
}
