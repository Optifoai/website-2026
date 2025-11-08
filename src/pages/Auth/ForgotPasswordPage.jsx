import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import InputField from '../../components/common/InputField/InputField';
import Button from '../../components/common/Button/Button';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await forgotPassword(email);
      setMessage('If an account with that email exists, a password reset link has been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <h2>Forgot Password</h2>
      <p>Enter your email address and we will send you a link to reset your password.</p>
      <form onSubmit={handleSubmit}>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Button type="submit">Send Reset Link</Button>
      </form>
      <p>Remember your password? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default ForgotPasswordPage;