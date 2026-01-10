import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { notify, EMPTY_OBJECT } from '../../utils/helpers';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

function SignupPage() {
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const { register, handleSubmit, control, watch , formState} = useForm();
  const { errors, isDirty, isValid } = formState;
  const data = watch(); // all form values
  const { t } = useTranslation();
  // const accessToken=localStorage.getItem('authToken')
  const [userInput, setUserInput] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            terms: false,
            showPassword: true,
            phone:'',
            countryCode:'',
            rowphone:''
        }
    );
      useEffect(() => {
          if (isAuthenticated) {
              navigate('/dashboard')
          }
      }, [isAuthenticated, navigate])

    const handleOnChangePhone = (value, data) => {
        let rowphone=value.slice(data.dialCode.length)
        let areaCode='+'+data.dialCode
        
        setUserInput({
            ...userInput, 
            phone:value,
            rowphone:rowphone,
            countryCode:areaCode,
            ['phone' + 'Error']: '',
        });
    };
    

  const onSubmit = async (data) => {
    setError('');
    try {
      let payload={...data,phone:userInput.rowphone,countryCode:userInput.countryCode,terms:userInput.terms}
      await signup(payload);
      // navigate('/verify'); // Redirect to dashboard on successful signup
    } catch (err) {
      notify('error', err.response?.data?.message ? err.response?.data?.message : 'Signup failed. Please Try again.')
      // setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="login-container signup-container">
      <div className="login-left">

      </div>
      <div className="login-right">
        <div className="login-card position-relative">
           <Link to="/login"><img className='back-arrow' src='back-arrow.svg'/></Link> 
          <div className="login-logo">
            <div className='logo-blk'>
              <img src="signup-logo.png" alt="Logo" />
            </div>
          </div>

          <hr className='divider' />

          <h5 className="login-title">{t('signupTitle')}</h5>
          <p className="login-subtext">{t('signupSubtitle')}</p>
          <div className="form-field">
            <form onSubmit={handleSubmit(onSubmit)}>
              {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
              <div className="f-group">
                <label className='form-label'>{t('fullNameLabel')}</label>
                <input type="text" className="form-control"
                  {...register("fullName", { required: "Full Name is required" })} />
                {errors.fullName && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{errors.fullName.message}</p>}
              </div>
              <div className="f-group">
                <label className='form-label'>{t('companyNameLabel')}</label>
                <input type="text" className="form-control"
                  {...register("companyName", { required: "Company Name is required" })} />
                {errors.companyName && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{errors.companyName.message}</p>}

              </div>
               <div className="f-group">
                <label className='form-label'>{t('mobileLabel')}</label>
                {/* <input type="text" className="form-control"
                  {...register("companyName", { required: "Company Name is required" })} /> */}
                  <Controller
                    name="phone"
                    className="form-control"
                    control={control}
                    rules={{ required: "Mobile number is required" }}
                    render={({ field }) => (
                      <PhoneInput
                        {...field}
                        country={'in'}
                        placeholder="Enter phone number"
                        inputClass={'phone-input'}
                        value={field.value} 
                        onChange={(value, countryData) => {
                          handleOnChangePhone(value, countryData); // your logic
                          field.onChange(value);                   // update RHF form value
                        }}
                      />
                    )}
                  />
                {errors.phone && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{errors.phone.message}</p>}

              </div>
              <div className="f-group">
                <label className='form-label'>{t('emailAddressLabel')}</label>
                <input type="email" className="form-control"
                  {...register("email", { required: "Email is required" })} />
                {errors.email && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{errors.email.message}</p>}

              </div>
              <div className="f-group">
                <label className='form-label'>{t('passwordLabel')}</label>
                <input type={userInput.showPassword ? "text" : "password"} className="form-control"
                  {...register("password", { required: "Password is required" })} />
                {errors.password && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{errors.password.message}</p>}
                <img className='eye-icon close' src='eye-close.png' onClick={()=>setUserInput({...userInput,showPassword:!userInput.showPassword})}/>
                {/* <img className='eye-icon open' src='eye-open.png'/> */}
              </div>
               <div className="checkbox-row">
              <input type="checkbox" id="updates" checked={userInput.terms} onChange={()=>setUserInput({...userInput,terms:!userInput.terms})} />
         
              <label for="updates">Yes, send me updates, tips, and news from Optifo.</label>
            </div>

            <p className="register-link">
              <Trans i18nKey="termsAndConditions">
                By clicking below, you agree to the Optifo <a href="https://optifo.com/terms/" target='_blank'>Terms & Condition</a> and <a href='https://optifo.com/privacy-policy/' target='_blank'>Privacy Policy.</a>
              </Trans>
            </p>
              <div className="f-group mb-5">
                <button type="submit" className="btn btn-login">{t('signupButton')}</button>
              </div>
            </form>

           
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;