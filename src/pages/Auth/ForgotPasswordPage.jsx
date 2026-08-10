import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { EMPTY_OBJECT, notify } from '../../utils/helpers';

function ForgotPasswordPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const { isAuthenticated, isLoading } = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (data) => {
    setError('');
    setMessage('');
    try {
      await forgotPassword(data.email);
      // setMessage('If an account with that email exists, a password reset link has been sent.');
    } catch (err) {
       notify('error',err?.message ? err?.message :'Something went wrong!')
    }
  };

  return (
    <div class="login-container">
      <div class="login-left">

      </div>
      <div class="login-right">
        <div class="login-card position-relative">
          <Link to="/login"><img className='back-arrow' src='/images/back-arrow.svg' /></Link>
          <div class="login-logo">
            <div className='logo-blk'>
              <img src="/images/optifo-logo.png" alt="Logo" />
            </div>
          </div>

          <hr className='divider' />

          <h5 class="login-title">Verify Your Email</h5>
          <p class="login-subtext">
           Please enter your registered email address (name@email.com).
          </p>
          <div className="form-field">
            <form onSubmit={handleSubmit(onSubmit)}>
              {message && <p style={{ color: 'green' }}>{message}</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <div className="f-group mb-3">
                <label className='form-label'>Email Address</label>
                <input type="email" className="form-control"
                  {...register("email", { required: "Email is required" })} />
                {errors.email && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{errors.email.message}</p>}

              </div>

              <div className="f-group">
                <button type="submit" class="btn btn-login">VERIFY EMAIL</button>
              </div>
            


            <p class="register-link mt-5">
              Didn’t receive the code? <button type='submit' >Resend</button>
            </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;