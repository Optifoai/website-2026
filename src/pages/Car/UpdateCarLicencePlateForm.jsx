import React, { useEffect, useReducer } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { EMPTY_ARRAY, EMPTY_OBJECT, notify } from '../../utils/helpers';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { updateCarLicencePlateDetails } from '../../Redux/Actions/carAction';
import { useNavigate } from 'react-router-dom';
import { CheckIcon } from '../../components/common/model/svg';

function UpdateCarLicencePlateForm(props) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { carDetailsData, dispatch, onUpdate, onClose, getCarData, userDetails, customeClass } = props;
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    const [formdata, setFormdata] = useReducer((state, newState) => ({ ...state, ...newState }),
        {
            activeLogoURL: '',
            formloader: false,
        }
    );

    const displayPlate = userDetails?.number_plates || [];

      const ActiveLogo = (e, backgroundId) => {
        const { value } = e.target
        if (formdata?.activeLogoId === backgroundId) {
            setFormdata({ ...formdata, activeLogoId: '', activeLogoURL: '', });
        } else {
            setFormdata({ ...formdata, activeLogoId: backgroundId, activeLogoURL: value });
        }

    };

   
    const handelLicencePlateUpdate = (data) => {
        
        const payload = {
            "numberPlate": formdata?.activeLogoURL,
            "carId": carDetailsData.carDetails._id,
            "carImage": carDetailsData?.selectedImage[0],
        }
        setFormdata({ formloader: true });
        dispatch(updateCarLicencePlateDetails(payload)).then((res) => {
             onClose(); // Close modal on successful submission
             setFormdata({ formloader: false });
            if (res?.processedS3Url) {
                getCarData()
                notify('success', res?.message || 'Licence plate applied successfully.')
                return true;
            } else {
                const errorMessage = res?.error?.responseMessage || res?.message || 'Something went wrong!';
                notify('error', errorMessage)
            }
        }).catch((err) => {
            notify('error', err?.message ? err?.message : 'Something went wrong!')
             onClose(); // Close modal on successful submission
             setFormdata({ formloader: false });
        });
        // onUpdate(data); // This would be the function to dispatch the update API call
       
    };

    return (
        <>

            <div class="modal-body">
                <div class="modal-header">
                    <h5>Update Car Licence Plate</h5>
                </div>
                <div className="account-tab mt-3">
                <div className="custom-scrollbars">
                    <div className="plate-list bg-logo-blk flex-wrap">
                        {displayPlate?.map((items, i) => {
                            return (
                                <div className="card" key={i}>
                                    <div className="account-card-list">
                                  
                                        <div className='status-active'
                                        // onClick={(e) => ActiveLogo(e, items._id)}
                                        >
                                            <input
                                                type="checkbox"
                                                // onChange={() => {
                                                //     console.log();
                                                // }}
                                                onChange={(e) => ActiveLogo(e, items._id)}
                                                // checked={items.isActive}
                                                checked={items._id == formdata?.activeLogoId}
                                                name="activeValueLogo"
                                                value={items.backgroundImage}
                                            // value={activeLogo.activeValueLogo}
                                            />

                                            <div className="select-bg">
                                                <div>
                                                    <CheckIcon />
                                                    <div
                                                        className="bg-lable text-uppercase">
                                                        {t('active_text')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {items.backgroundImage ? (
                                            <div
                                                className="card">
                                                <img
                                                    src={items.backgroundImage}
                                                    className="plate-mxw-100"
                                                />
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {/*             
                                            {displayPlate.length < 10 && (
                                                <div className="mob-100 mb-2">
                                                    <div className="card add-card">
                                                        <div className="add-content" onClick={() => setLocalState({ addModalOpen: true, uploadedfileType: 'number_plate' })}>
                                                            <div className="add-icon"><img src='/images/add-icon.svg' alt="add icon" /></div>
                                                            <p>Add Plate</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )} */}

                        {/* Add plate management UI here */}

                    </div>
                </div>
</div>
                <div className="form-field mt-3">

                    <form onSubmit={handleSubmit(handelLicencePlateUpdate)}>

                        <div className='popup-btn'>
                            <button type="submit" class="btn btn-login">{t('UpdateText')}</button>
                            <button type="button" disabled={formdata.formloader} class="btn btn-secondary" onClick={onClose}>{t('cancelText')}</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

UpdateCarLicencePlateForm.propTypes = {
    dispatch: PropTypes.func,
    data: PropTypes.object,
    loader: PropTypes.bool,
    userDetails: EMPTY_OBJECT,
    carDetailsData: PropTypes.object,
    onUpdate: PropTypes.func,
    onClose: PropTypes.func,
    carsBrandList: PropTypes.array,


}

UpdateCarLicencePlateForm.defaulProps = {
    dispatch: PropTypes.func,
    data: EMPTY_OBJECT,
    userDetails: EMPTY_OBJECT,
    loader: PropTypes.bool,
    carsBrandList: EMPTY_ARRAY,


}

function mapStateToProps({ login }) {
    return {
        isUserLogin: login?.isUserLogin,
        userDetails: login?.userDetails,
    }
}

export default connect(mapStateToProps)(UpdateCarLicencePlateForm)