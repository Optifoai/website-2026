import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button/Button';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-page">
      <h2>Welcome to your Dashboard, {user?.username || 'User'}!</h2>
      <p>This is your private dashboard content.</p>
      <Button onClick={handleLogout}>Logout</Button>
      <p>
        <Button onClick={() => navigate('/profile')}>View Profile</Button>
      </p>
    </div>
  );
}

export default DashboardPage;
