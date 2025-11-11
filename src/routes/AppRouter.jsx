import { BrowserRouter as Router, Routes, Route,Navigate } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'
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
    const dispatch = useDispatch()
     const navigate = useNavigate();
  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center' }}>
      <Header /> {/* Optional: Add a header */}
      <main style={{ flex: 1, width: '100%', maxWidth: '1200px', padding: '1rem' }}>
        <Routes>
          {/* Public Routes */}
         
          <Route path="/login" element={<LoginPage dispatch={dispatch} navigate={navigate} />} />
          <Route path="/signup" element={<SignupPage dispatch={dispatch} navigate={navigate}/>} />
          <Route path="/forgot-password" element={<ForgotPasswordPage dispatch={dispatch} navigate={navigate}/>} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage dispatch={dispatch} navigate={navigate}/></PrivateRoute>}/>
          <Route path="/profile" element={ <PrivateRoute> <ProfilePage dispatch={dispatch} navigate={navigate}/> </PrivateRoute> } />

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
