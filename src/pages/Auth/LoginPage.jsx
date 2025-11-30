import React, { useEffect, useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { notify } from '../../utils/helpers';;
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';

function LoginPage(props) {
  const { navigate, Link } = props
  const { login, isAuthenticated } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { t } = useTranslation();

  const onSubmit = async (data) => {
    try {
      await login(data);
      // navigate('/dashboard'); // Redirect to dashboard on successful login
    } catch (err) {
      notify('error', err.response?.data?.message ? err.response?.data?.message : 'Login failed. Please check your credentials.')
    }
  };



  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated])

  const [userInput, setUserInput] = useReducer((state, newState) => ({ ...state, ...newState }),
    {
      showPassword: false,
    }
  );


  return (
    <div class="login-container">
      <div class="login-left">

      </div>
      <div class="login-right">
        <div class="login-card">
          <div class="login-logo">
            <div className='logo-blk'>
              <img src="optifo-logo.png" alt="Logo" />
            </div>
          </div>

          <hr className='divider' />

          <h5 class="login-title">{t('loginTitle')}</h5>
          <p class="login-subtext">{t('loginSubtitle')}</p>
          <div className="form-field">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div class="f-group mb-3">
                <label className='form-label'>{t('emailAddressLabel')}</label>
                <input type="email" class="form-control"
                  {...register("email", { required: "Email is required" })} />
                {errors.email && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{errors.email.message}</p>}
              </div>
              <div class="f-group mb-3">
                <label className='form-label'>{t('passwordLabel')}</label>
                <input type={userInput.showPassword ? "text" : "password"} class="form-control"
                  {...register("password", { required: "Password is required" })} />
                {errors.password && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{errors.password.message}</p>}
                <img className='eye-icon close' src='eye-close.png' onClick={() => setUserInput({ ...userInput, showPassword: !userInput.showPassword })} />
                {/* <img className='eye-icon open' src='eye-open.png'/> */}
              </div>
              <div className="f-group">
                <button type="submit" class="btn btn-login">{t('loginButton')}</button>
              </div>
            </form>

            <Link to="/forgot-password" class="forgot-password">{t('forgotPasswordLink')}</Link>
            <p className="register-link mb-5">
              <Trans i18nKey="dontHaveAccount">
                Don't have an account? <Link to="/signup">Sign Up</Link> here
              </Trans>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
