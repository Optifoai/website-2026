import React, { useEffect, useReducer, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { EMPTY_OBJECT, notify, EMPTY_STRING, EMPTY_ARRAY } from '../../utils/helpers';
import { updateUserProfile } from '../../Redux/Actions/loginAction'; // Assuming this action exists
import CommonModel from '../../components/common/model/CommonModel';
import { getCarDelete } from '../../Redux/Actions/carAction';
import { Tab, Tabs } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2'
import LoaderSpiner from '../../hooks/LoaderSpiner';
import EditEmailForm from './EditEmailForm';
function AccountPage(props) {
    const { dispatch, userDetails, navigate, loader } = props;
    const { user, getUserData } = useAuth();
    const { t, i18n } = useTranslation();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const [formdata, setFormdata] = useReducer((state, newState) => ({ ...state, ...newState }),
        {
            tabValue: 1,
            showCurrentPassword: false,
            showNewPassword: false,
            showConfirmPassword: false,
            password: EMPTY_STRING,
            userDetails: EMPTY_OBJECT,
            loader: false,
            editModelOpen: false,


        }
    );

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            companyName: '',
            language: 'en',
            phone: "",
            countryCode: "+91",
        }
    });

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
        watch: watchPassword,
    } = useForm();




    /* ================= LOAD USER ================= */
    useEffect(() => {
        const localUser = localStorage.getItem("userData")
            ? JSON.parse(localStorage.getItem("userData"))
            : EMPTY_OBJECT;

        const profile =
            user?.userProfile ??
            userDetails?.userProfile ??
            localUser;

        if (profile) {
            setValue("fullName", profile.fullName || "");
            setValue("email", profile.email || "");
            setValue("companyName", profile.companyDetails?.companyName || "");
            setValue("language", profile.languageSelected || "en");
            setValue("phone", profile.phone ? String(profile.countryCode) + String(profile.phone) : "");
            setValue("countryCode", profile.countryCode || "+91");

            // setState({ loader: false });
        }
    }, [user, userDetails, setValue]);

    const changeTabValue = (e) => {
        if (e == 1) {
            setFormdata({ tabValue: 1 });
        } else {
            setFormdata({ tabValue: 2 });
        }
    };

    const onSubmit = (data) => {
        setFormdata({ loader: true })
        const phoneWithoutCountryCode = data.phone.startsWith(data.countryCode.replace('+', '')) ? data.phone.substring(data.countryCode.length - 1) : data.phone;
        const payload = {
            fullName: data.fullName,
            email: data.email,
            companyName: data.companyName,
            language: data.language,
            countryCode: data.countryCode,
            phone: phoneWithoutCountryCode,
        };

        dispatch(updateUserProfile(payload)).then(res => {
            if (res?.statusCode == '1') {
                getUserData()
                notify('success', 'Profile updated successfully!');
                setFormdata({ loader: false })

            } else {
                setFormdata({ loader: false })

                notify('error', res?.error?.responseMessage || 'Failed to update profile.');
            }
        }).catch(err => {
            notify('error', err?.message || 'An error occurred.');
            setFormdata({ loader: false })

        });
    };

    const onChangePasswordSubmit = (data) => {
        setFormdata({ loader: true })

        let payload =
        {
            "optifoPassword": data?.currentPassword,
            "password": data?.newPassword
        }

        dispatch(updateUserProfile(payload)).then(res => {
            setFormdata({ loader: false })

            if (res?.statusCode == '1') {
                notify('success', res?.responseData?.message ? res?.responseData?.message : 'Password updated successfully!');
            } else {
                notify('error', res?.error?.responseMessage || 'Failed to update Password.');
            }
        }).catch(err => {
            setFormdata({ loader: false })

            notify('error', err?.message || 'An error occurred.');
        });
        // Here you would dispatch an action to change the password
    };

    const handleDeleteAccount = () => {
        setFormdata({ loader: true })

        let getLocalUserData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : EMPTY_OBJECT
        let userdata = user && user != null ? user?.userProfile : userDetails?.userProfile ? userDetails?.userProfile : getLocalUserData

        let payLoad = {
            userId: userdata._id,
        };
        dispatch(getCarDelete(payLoad)).then((res) => {
            setFormdata({ loader: false })

            if (res?.statusCode == '1') {
                notify('success', res.response?.data?.message ? res.response?.data?.message : 'Account deleted successful.')


            } else {
                notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!')
            }
        }).catch((err) => {
            setFormdata({ loader: false })

            notify('error', err?.message ? err?.message : 'Something went wrong!')
        });
        setDeleteModalOpen(false);

    };
    const editEmailForm = (
        <EditEmailForm  formdata={formdata} onClose={() => setFormdata({ editModelOpen: false })} />
    )

    return (
        <>
            {loader ? <LoaderSpiner /> : <div className='d-flex justify-between mt-4 '>
                <section className="flex-1">
                    <Tabs
                        defaultActiveKey={1}
                        activeKey={formdata?.tabValue}
                        className='custom-tabs'
                        onSelect={(e) => changeTabValue(e)}
                    >
                        <Tab eventKey={1} title='Account Info'>
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
                                    <div className="mb-3 position-relative ">
                                        <label className='form-label'>Email Address</label>
                                        <div className='d-flex justify-content-between align-items-center'>
                                        <input type="email" className="form-control" {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })} readOnly />
                                           <a href="#" className="edit-account" onClick={() => { setFormdata({ editModelOpen: true }) }}>
                                          
                                            <img class="edit-icon " src="/images/icon/Edit-Active.png"></img>
                                        </a>
                                        </div>
                                        {errors.email && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{errors.email.message}</p>}
                                     

                                    </div>
                                    <div className="mb-3">
                                        <label className='form-label'>Company Name</label>
                                        <input type="text" className="form-control" {...register("companyName", { required: "Company name is required" })} />
                                        {errors.companyName && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{errors.companyName.message}</p>}
                                    </div>

                                    {/* PHONE INPUT */}
                                    <div className="mb-3">
                                        <label>Phone</label>
                                        <Controller
                                            name="phone"
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <PhoneInput
                                                    country="in"
                                                    value={field.value || ""}
                                                    onChange={(value, country) => {
                                                        field.onChange(value);
                                                        setValue("countryCode", `+${country.dialCode}`);
                                                    }}
                                                    countryCodeEditable={false}
                                                />
                                            )}
                                        />
                                    </div>

                                    <div className="mb-3">

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
                                    </div>
                                    <div className='modal-footer popup-btn d-flex max-w-320 mt-4'>
                                        <button type="submit" className="btn btn-login flex-1">Save Changes</button>

                                    </div>
                                </form>
                            </div>
                        </Tab>
                        <Tab eventKey={2} title='Change Password'>
                            <div className="form-field mt-3  max-w-320">
                                <form onSubmit={handlePasswordSubmit(onChangePasswordSubmit)}>
                                    <div className="mb-3 position-relative">
                                        <label className='form-label'>Current Password</label>
                                        <input type={formdata.showCurrentPassword ? "text" : "password"} className="form-control"
                                            {...registerPassword("currentPassword", { required: "Current Password is required" })} />
                                        {passwordErrors.currentPassword && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{passwordErrors.currentPassword.message}</p>}

                                        <img className='eye-icon close' src={formdata.showCurrentPassword ? '/eye-open.png' : '/eye-close.png'} onClick={() => setFormdata({ showCurrentPassword: !formdata.showCurrentPassword })} />
                                    </div>

                                    <div className="mb-3 position-relative">
                                        <label className='form-label'>New Password</label>
                                        <input type={formdata.showNewPassword ? "text" : "password"} className="form-control"
                                            {...registerPassword("newPassword", {
                                                required: "New Password is required",
                                                minLength: { value: 8, message: "Password must be at least 8 characters" }
                                            })} />
                                        {passwordErrors.newPassword && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{passwordErrors.newPassword.message}</p>}
                                        <img className='eye-icon close' src={formdata.showNewPassword ? '/eye-open.png' : '/eye-close.png'} onClick={() => setFormdata({ showNewPassword: !formdata.showNewPassword })} />
                                    </div>

                                    <div className="mb-3 position-relative">
                                        <label className='form-label'>Confirm New Password</label>
                                        <input type={formdata.showConfirmPassword ? "text" : "password"} className="form-control"
                                            {...registerPassword("confirmPassword", {
                                                required: "Please confirm your new password",
                                                validate: value =>
                                                    value === watchPassword('newPassword') || "The passwords do not match"
                                            })} />
                                        {passwordErrors.confirmPassword && <p className="error-message" style={{ color: 'red', fontSize: '12px' }}>{passwordErrors.confirmPassword.message}</p>}
                                        <img className='eye-icon close' src={formdata.showConfirmPassword ? '/eye-open.png' : '/eye-close.png'} onClick={() => setFormdata({ showConfirmPassword: !formdata.showConfirmPassword })} />
                                    </div>

                                    <div className='modal-footer popup-btn d-flex max-w-320 mt-4'>
                                        <button type="submit" className="btn btn-login flex-1">Change Password</button>

                                    </div>
                                </form>
                            </div>
                        </Tab>

                    </Tabs>

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
            </div>}

            <CommonModel show={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <img src="/delete-image.png" alt="Delete confirmation" />
                <h2>Are you sure you want to delete your account?</h2>
                <p>When you delete your Optifo account, all your images will be deleted and gone forever.</p>
                <div className="popup-btn">
                    <button type="button" className="btn btn-login" onClick={handleDeleteAccount}>Yes, Delete</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
                </div>
            </CommonModel>

            {/*Email update model */}
            <CommonModel size="modal-email" show={formdata.editModelOpen} customeClass={'mw-100'} onClose={() => { setFormdata({ editModelOpen: false }) }}>

                {editEmailForm}


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
        loader: login?.loader

    }
}

export default connect(mapStateToProps)(AccountPage)