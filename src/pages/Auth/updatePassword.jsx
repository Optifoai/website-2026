import React, { useEffect, useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { EMPTY_STRING, notify } from '../../utils/helpers';;
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import { useSearchParams } from "react-router-dom";
import { client } from '../../services/axioConfig';
import { updatePassword } from '../../Redux/Actions/loginAction';

function UpdatePassword(props) {
  const { dispatch, userDetails, navigate, loader } = props;
 
  const { login, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  let token = searchParams.get("token"); 
  const accessToken = localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null

  const [formdata, setFormdata] = useReducer((state, newState) => ({ ...state, ...newState }),
    {
      showNewPassword: false,
      showConfirmPassword: false,
      password: EMPTY_STRING,
      loader: false,

    }
  );

  const { register, handleSubmit, control, setValue, formState: { errors },watch: watchPassword } = useForm({});


  const onSubmit =  (data) => {
    let payload={
      newPassword:data.newPassword,
      confirmPassword:data.confirmPassword,
    }
        dispatch(updatePassword(payload,token)).then(res => {
          let responce=res?.data
            if (responce?.statusCode == '1') {               
                notify('success', responce?.responseData.message ? responce?.responseData.message : 'Password updated successfully!');
                setFormdata({ loader: false })
                 navigate('/login')

            }else if(responce?.error?.responseMessage=='Your Token has been expired'){
                setFormdata({ loader: false })
                notify('error', 'You are using an Expired password reset link. Please again generate link by clicking on forgot password.');
            } else {
                setFormdata({ loader: false })
                notify('error', responce?.error?.responseMessage || 'Failed to update password.');
            }
        }).catch(err => {
            notify('error', err?.message || 'An error occurred.');
            setFormdata({ loader: false })

        });
  };


  useEffect(() => {
    if (isAuthenticated && accessToken) {
      navigate('/dashboard')
    } else {
      logout()
    }
  }, [isAuthenticated, accessToken])

  useEffect(()=>{
     if(!token){
            //alert("You have not requested this page correctly... you have to request this page again ...");
            notify('error', 'You have not been redirected to this page properly...Taking you back to the login page')
            navigate('/login')

        }
  },[])

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
              <img src="/images/optifo-logo.png" alt="Logo" />
            </div>
          </div>

          <hr className='divider' />

          <h5 class="login-title">{t('updatePasswordText')}</h5>
          <div className="form-field">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="f-group">
                <label className='form-label'>New Password</label>
                <input type={formdata.showNewPassword ? "text" : "password"} className="form-control"
                  {...register("newPassword", {
                    required: "New Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                  })} />
                {errors.newPassword && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{errors.newPassword.message}</p>}
                <img className='eye-icon close' src={formdata.showNewPassword ? '/images/eye-open.png' : '/images/eye-close.png'} onClick={() => setFormdata({ showNewPassword: !formdata.showNewPassword })} />
              </div>

              <div className="f-group">
                <label className='form-label'>Confirm New Password</label>
                <input type={formdata.showConfirmPassword ? "text" : "password"} className="form-control"
                  {...register("confirmPassword", {
                    required: "Please confirm your new password",
                    validate: value =>
                      value === watchPassword('newPassword') || "The passwords do not match"
                  })} />
                {errors.confirmPassword && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{errors.confirmPassword.message}</p>}
                <img className='eye-icon close' src={formdata.showConfirmPassword ? '/images/eye-open.png' : '/images/eye-close.png'} onClick={() => setFormdata({ showConfirmPassword: !formdata.showConfirmPassword })} />
              </div>
              <div className="f-group">
                <button type="submit" class="btn btn-login">{t('submit_text')}</button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdatePassword;
