import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { EMPTY_OBJECT } from '../../utils/helpers';
import OtpInput from 'react-otp-input';

function VerifyOtp() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { verifyOtp } = useAuth(); // Assuming you have a verifyOtp function in useAuth
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors } } = useForm();

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
      // await verifyOtp(data.otp); // Pass the OTP to your auth context
      console.log("OTP Submitted:", data.otp);
      setMessage('OTP verified successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP. Please try again.');
    }
  };

  return (

    <div className="login-container">
      <div className="login-left">

      </div>
      <div className="login-right">
        <div className="login-card position-relative">
          <Link to="/signup"><img className='back-arrow' src='back-arrow.svg' /></Link>
          <div className="login-logo">
            <div className='logo-blk'>
              <img src="optifo-logo.png" alt="Logo" />
            </div>
          </div>

          <hr className='divider' />

          <h5 className="login-title">Verify Your Email</h5>
          <p className="login-subtext">
            Enter the verification code sent to your email address name@email.com
          </p>
          <div className="form-field">
            <form onSubmit={handleSubmit(onSubmit)}>
              {message && <p style={{ color: 'green' }}>{message}</p>}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <div className="f-group mb-3">
                <Controller
                  name="otp"
                  control={control}
                  rules={{ required: "OTP is required", minLength: { value: 6, message: "OTP must be 6 digits" } }}
                  render={({ field }) => (
                    <OtpInput
                      {...field}
                      numInputs={6}
                      renderSeparator={<span>-</span>}
                      renderInput={(props) => <input {...props} />}
                      inputStyle="otp-box"
                      containerStyle="otp-container"
                    />
                  )}
                />
                {errors.otp && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{errors.otp.message}</p>}
              </div>

              <div className="f-group">
                <button type="submit" className="btn btn-login">VERIFY EMAIL</button>
              </div>
            </form>


            <p className="register-link mt-5">
              Didn’t receive the code? <a href="#">Resend</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;