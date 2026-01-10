import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { EMPTY_OBJECT, notify } from '../../utils/helpers';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { updateUserEmail, updateUserProfile } from '../../Redux/Actions/loginAction';
import { useAuth } from '../../hooks/useAuth';

function EditEmailForm(props) {
    const { t } = useTranslation();
    const { dispatch, onClose } = props;
    const [showPassword, setShowPassword] = useState(false);
    const { getUserData } = useAuth();

    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        mode: 'onBlur'
    });

    const newEmail = watch("newEmail");

    const onEditSubmit = (data) => {
        const payload = {
            "email": data.newEmail,
            "optifoPassword": data.optifoPassword,
            "additionalEmail": []
        }
        dispatch(updateUserEmail(payload)).then((res) => {
            if (res?.statusCode == '1') {
                getUserData();
                notify('success', res?.responseData?.message || 'Email updated successfully!');
                onClose(); // Close modal on successful submission
            } else {
                notify('error', res?.error?.responseMessage || 'Failed to update email.');
            }
        }).catch((err) => {
            notify('error', err?.message || 'An error occurred.');
        });
    };

    return (
        <div className="">
                <h2 className='popup-heading'>{t('editEmailTitle', 'Edit Email Address')}</h2>
          

            <div className="form-field mt-3">
                <form onSubmit={handleSubmit(onEditSubmit)}>

                    <div className="mb-3">
                        <label className='form-label'>New Email</label>
                        <div className="f-group">
                        <input type="email" className="form-control" {...register('newEmail', {
                            required: 'New email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })} />
                        </div>
                        {errors.newEmail && <small className="text-danger">{errors.newEmail.message}</small>}
                    </div>
                    <div className="mb-3">
                        <label className='form-label'>Confirm Email</label>
                        <div className="f-group">
                        <input type="email" className="form-control" {...register('confirmEmail', {
                            required: 'Please confirm your new email',
                            validate: value => value === newEmail || "The emails do not match"
                        })} />
                        </div>
                        {errors.confirmEmail && <small className="text-danger">{errors.confirmEmail.message}</small>}
                    </div>
                    <div className="mb-3">
                        <label className='form-label'>Password</label>
                        <div className="f-group">
                            <input type={showPassword ? "text" : "password"} className="form-control" {...register('optifoPassword', { required: 'Password is required to make this change' })} />
                           
                           <img
                  className={`eye-icon ${showPassword ? 'open' : 'close'}`}
                  src={showPassword ? 'eye-open.png' : 'eye-close.png'}
                  onClick={() => setShowPassword(!showPassword)}
                />
                        </div>
                        {errors.optifoPassword && <small className="text-danger">{errors.optifoPassword.message}</small>}
                    </div>
                    <div className='popup-btn'>
                        <button type="submit" class="btn btn-login">{t('UpdateText')}</button>
                        <button type="button" class="btn btn-secondary" onClick={onClose}>{t('cancelText')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

EditEmailForm.propTypes = {
    dispatch: PropTypes.func,
    onClose: PropTypes.func,
}

EditEmailForm.defaulProps = {
    dispatch: PropTypes.func,
    onClose: () => { },
}

function mapStateToProps({ login }) {
    return {
        isUserLogin: login?.isUserLogin,
        userDetails: login?.userDetails,
    }
}

export default connect(mapStateToProps)(EditEmailForm)