import React, { useEffect, useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { notify } from '../../utils/helpers';;
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';

function LoginPage(props) {
  const { navigate, Link } = props
  const { login, isAuthenticated ,logout} = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { t } = useTranslation();
  const accessToken = (() => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    try {
      return JSON.parse(token);
    } catch {
      localStorage.removeItem('authToken');
      return null;
    }
  })();

  const onSubmit = async (data) => {
    try {
      await login(data);
      // navigate('/dashboard'); // Redirect to dashboard on successful login
    } catch (err) {
      notify('error', err.response?.data?.message ? err.response?.data?.message : 'Login failed. Please check your credentials.')
    }
  };


  useEffect(() => {   
    if (isAuthenticated && accessToken) {
      navigate('/dashboard')
    }else{
        logout()
    }
  }, [isAuthenticated,accessToken])

  const [userInput, setUserInput] = useReducer((state, newState) => ({ ...state, ...newState }),
    {
      showPassword: false,
    }
  );

  

  return (
    <div className="login-container">
      <div className="login-left">

      </div>
      <div className="login-right">
        <div className="login-card">
          <div className="login-logo">
            <div className='logo-blk'>
              <img src="/images/optifo-logo.png" alt="Logo" />
            </div>
          </div>

          <hr className='divider' />

          <h5 className="login-title">{t('loginTitle')}</h5>
          <p className="login-subtext">{t('loginSubtitle')}</p>
          <div className="form-field">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="f-group">
                <label className='form-label'>{t('emailAddressLabel')}</label>
                <input type="email" className={`form-control ${errors.email ? 'error' : ''}`}
                  {...register("email", { required: "Email is required" })} />
                {/* {errors.email && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{errors.email.message}</p>} */}
              </div>
              <div className="f-group">
                <label className='form-label'>{t('passwordLabel')}</label>
                <input type={userInput.showPassword ? "text" : "password"} className={`form-control ${errors.password ? 'error' : ''}`}
                  {...register("password", { required: "Password is required" })} />
                {/* {errors.password && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{errors.password.message}</p>} */}
                <img
                  className={`eye-icon ${userInput.showPassword ? 'open' : 'close'}`}
                  src={userInput.showPassword ? '/images/eye-open.png' : '/images/eye-close.png'}
                  onClick={() =>
                    setUserInput({
                      ...userInput,
                      showPassword: !userInput.showPassword,
                    })
                  }
                />
              </div>
              <div className="f-group">
                <button type="submit" className="btn btn-login">{t('loginButton')}</button>
              </div>
            </form>

            <Link to="/forgot-password" className="forgot-password">{t('forgotPasswordLink')}</Link>
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
