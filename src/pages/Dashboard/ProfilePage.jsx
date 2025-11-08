import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

function ProfilePage() {
  const { user } = useAuth();

  // The user object might be null initially or if the data isn't fetched yet.
  // This provides a fallback UI.
  if (!user) {
    return (
      <div>
        <h2>Profile Page</h2>
        <p>Loading user data or user not found...</p>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h2>User Profile</h2>
      <p><strong>Username:</strong> {user.username || 'Not available'}</p>
      <p><strong>Email:</strong> {user.email || 'Not available'}</p>
      <br />
      <Link to="/dashboard">Back to Dashboard</Link>
    </div>
  );
}

export default ProfilePage;