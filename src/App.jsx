// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './hooks/useAuth';

// Import Pages
// import LoginPage from './pages/Auth/LoginPage';
// import SignupPage from './pages/Auth/SignupPage';
// import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
// import DashboardPage from './pages/Dashboard/DashboardPage';
// import ProfilePage from './pages/Dashboard/ProfilePage';
// import NotFoundPage from './pages/NotFoundPage';

// Layout Components (optional, for consistent structure)
// import Header from './components/layout/Header/Header';
// import Footer from './components/layout/Footer/Footer';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <AppRouter/>
   
  );
}

export default App;
