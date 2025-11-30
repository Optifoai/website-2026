import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
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
import VerifyOtp from '../pages/Auth/VerifyOtp';
import BackgroundLogoPage from '../pages/BackgroundLogo/BackgroundLogoPage';
import CreditsPage from '../pages/Credits/CreditsPage';
import BillingPage from '../pages/Billing/BillingPage';
import AccountPage from '../pages/Account/AccountPage';
import CarDetails from '../pages/Car/CarDetails';


export default function AppRouter() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  return (
    <div className="app-container">
      <ToastContainer />
      {/* <Header /> Optional: Add a header */}
      <main>
        <Routes>
          {/* Public Routes */}

          <Route path="/login" element={<LoginPage dispatch={dispatch} navigate={navigate} Link={Link} />} />
          <Route path="/signup" element={<SignupPage dispatch={dispatch} navigate={navigate} Link={Link} />} />
          <Route path="/verify" element={<VerifyOtp dispatch={dispatch} navigate={navigate} Link={Link} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage dispatch={dispatch} navigate={navigate} Link={Link} />} />


          {/* Protected Routes */}

          <Route path="/dashboard" element={<PrivateRoute><DashboardPage dispatch={dispatch} navigate={navigate} Link={Link} /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute> <ProfilePage dispatch={dispatch} navigate={navigate} Link={Link} /> </PrivateRoute>} />
          <Route path="/my-account" element={<PrivateRoute> <AccountPage dispatch={dispatch} navigate={navigate} Link={Link} /> </PrivateRoute>} />

          <Route path="/background-logo" element={<PrivateRoute> <BackgroundLogoPage dispatch={dispatch} navigate={navigate} Link={Link} /> </PrivateRoute>} />
          <Route path="/credits" element={<PrivateRoute> <CreditsPage dispatch={dispatch} navigate={navigate} Link={Link} /> </PrivateRoute>} />
          <Route path="/billing" element={<PrivateRoute> <BillingPage dispatch={dispatch} navigate={navigate} Link={Link} /> </PrivateRoute>} />
          <Route path="/car/:id" element={<PrivateRoute> <CarDetails dispatch={dispatch} navigate={navigate} Link={Link} /> </PrivateRoute>} />
          
          {/* <Footer /> */}
          {/* Redirect to dashboard if logged in, otherwise to login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 Not Found Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {/* <Footer /> Optional: Add a footer */}
    </div>
  );
}
