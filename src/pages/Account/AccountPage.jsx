import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { EMPTY_OBJECT, notify } from '../../utils/helpers';
import { updateUserProfile } from '../../Redux/Actions/loginAction'; // Assuming this action exists
import CommonModel from '../../components/common/model/CommonModel';

function AccountPage(props) {
    const { dispatch } = props;
    const { user } = useAuth();
    console.log('coming user', user)
    const { t, i18n } = useTranslation();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            companyName: '',
            language: 'en'
        }
    });

    // Populate form with user data when the component mounts or user changes
    useEffect(() => {
        if (user) {
            setValue('fullName', user.fullName);
            setValue('email', user.email);
            setValue('companyName', user.companyName);
            setValue('language', i18n.language);
        }
    }, [user, setValue, i18n.language]);

    const onSubmit = (data) => {
        // Dispatch an action to update the user profile
        dispatch(updateUserProfile(data)).then(res => {
            if (res?.statusCode === '1') {
                notify('success', 'Profile updated successfully!');
            } else {
                notify('error', res?.error?.responseMessage || 'Failed to update profile.');
            }
        }).catch(err => {
            notify('error', err?.message || 'An error occurred.');
        });
    };

    const handleDeleteAccount = () => {
        // Logic to delete account would go here, likely dispatching another action
        console.log("Deleting account...");
        setDeleteModalOpen(false);
        notify('success', 'Account deletion initiated.');
    };

    return (
        <>
            <div className='d-flex justify-between mt-4 border-bottom-1'>
                <section className="flex-1">
                    <div className="form-field mt-3  max-w-320">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3">
                                <label className='form-label'>Name</label>
                                <input type="text" className="form-control" {...register("fullName", { 
                                    required: "Name is required",
                                    minLength: { value: 2, message: "Name must be at least 2 characters" }
                                })} />
                                {errors.fullName && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{errors.fullName.message}</p>}
                            </div>
                            <div className="mb-3">
                                <label className='form-label'>Email Address</label>
                                <input type="email" className="form-control" {...register("email", { 
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })} readOnly />
                                {errors.email && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{errors.email.message}</p>}
                            </div>
                            <div className="mb-3">
                                <label className='form-label'>Company Name</label>
                                <input type="text" className="form-control" {...register("companyName", { required: "Company name is required" })} />
                                {errors.companyName && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{errors.companyName.message}</p>}
                            </div>
                            <label className='form-label'>Language</label>
                            <Controller
                                name="language"
                                control={control}
                                render={({ field }) => (
                                    <div className="language-container">
                                        <label className="radio-item">
                                            <input type="radio" {...field} value="da" checked={field.value === 'da'} onChange={(e) => { field.onChange(e); i18n.changeLanguage('da'); }} />
                                            <span className="custom-radio"></span> Dansk
                                        </label>
                                        <label className="radio-item">
                                            <input type="radio" {...field} value="en" checked={field.value === 'en'} onChange={(e) => { field.onChange(e); i18n.changeLanguage('en'); }} />
                                            <span className="custom-radio"></span> English
                                        </label>
                                    </div>
                                )}
                            />
                            <div className='modal-footer popup-btn d-flex max-w-320 mt-4'>
                                <button type="submit" className="btn btn-login flex-1">Save Changes</button>
                                <button type="button" className="btn btn-secondary font12 flex-1 mt-0">Change Password</button>
                            </div>
                        </form>
                    </div>
                </section>
                <div className='car-details account-page-car'>
                    <div className="">
                        <img src="delete-image.png" alt="" />
                        <h2>Delete My Account</h2>
                        <p>If you delete your account, your images will be gone forever.</p>
                        <div className="max-130 mx-auto mt-3">
                            <button type="button" className="btn btn-login" onClick={() => setDeleteModalOpen(true)}>DELETE</button>
                        </div>
                    </div>
                </div>
            </div>

            <CommonModel show={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <img src="/delete-image.png" alt="Delete confirmation" />
                <h2>Are you sure?</h2>
                <p>This action cannot be undone. All your data will be permanently deleted.</p>
                <div className="popup-btn">
                    <button type="button" className="btn btn-login" onClick={handleDeleteAccount}>Yes, Delete</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
                </div>
            </CommonModel>
        </>
    );
}

AccountPage.propTypes = {
    dispatch: PropTypes.func,
    data: PropTypes.object,
    loader: PropTypes.bool,
    userDetails: EMPTY_OBJECT,

}

AccountPage.defaulProps = {
    dispatch: PropTypes.func,
    data: EMPTY_OBJECT,
    userDetails: EMPTY_OBJECT,
    loader: PropTypes.bool,

}

function mapStateToProps({ login }) {
    return {
        isUserLogin: login?.isUserLogin,
        userDetails: login?.userDetails,
    }
}

export default connect(mapStateToProps)(AccountPage)