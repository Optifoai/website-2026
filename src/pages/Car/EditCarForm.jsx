import React, { useEffect, useReducer } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {  EMPTY_ARRAY, EMPTY_OBJECT } from '../../utils/helpers';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { getCarBrandList, getCarList, updateCarDetails } from '../../Redux/Actions/carAction';
import { useNavigate } from 'react-router-dom';

function EditCarForm(props) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { carDetailsData,dispatch , onUpdate, onClose, getCarData} = props;

    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    const [formdata, setFormdata] = useReducer((state, newState) => ({ ...state, ...newState }),
            {
                carsBrandList: EMPTY_ARRAY,
            }
        );

    
        useEffect(() => {
            getCarBrand()
        }, [EMPTY_ARRAY])
        
    useEffect(() => {
        if (carDetailsData?.carDetails) {
            setValue('brand', carDetailsData.carDetails.carBrand);
            setValue('model', carDetailsData.carDetails.carModel);
            setValue('year', carDetailsData.carDetails.carYear);
            setValue('carId', carDetailsData.carDetails.carId);
        }
    }, [carDetailsData, setValue]);
    
        //get car list
        const getCarBrand = () => {
            dispatch(getCarBrandList()).then((res) => {
                if (res?.statusCode == '1') {
                    let data = res?.responseData?.carsList
                    setFormdata({ ...formdata, carsBrandList: data})
                    // notify('success', res.response?.data?.message ? res.response?.data?.message : 'data fetched Successful.')
                    return true;
                } else {
                    notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!')
                }
            }).catch((err) => {
                notify('error', err?.message ? err?.message : 'Something went wrong!')
            });
    
        };


    const onEditSubmit = (data) => {
        console.log('Form data submitted:', data);
       const payload= {
            "carBrand": data?.brand,
            "carId":    data?.carId,
            "carYear":  data?.year,
            "carModel": data?.model,
            "vehicleId": carDetailsData.carDetails._id
        }
        dispatch(updateCarDetails(payload)).then((res) => {
            if (res?.statusCode == '1') {
                let data = res?.responseData?.carsList
                getCarData()
                // setFormdata({ ...formdata, carsBrandList: data})
                notify('success', res.response?.data?.message ? res.response?.data?.message : 'data updated Successful.')
                return true;
            } else {
                notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!')
            }
        }).catch((err) => {
            notify('error', err?.message ? err?.message : 'Something went wrong!')
        });
        // onUpdate(data); // This would be the function to dispatch the update API call
        onClose(); // Close modal on successful submission
    };

  return (
    <>  
   
     <div class="modal-body">
            <div class="modal-header">
                <h5>Edit Car Information</h5>
            </div>

            <div className="form-field mt-3">
                <form onSubmit={handleSubmit(onEditSubmit)}>
                    <div class="mb-3">
                        <label className='form-label'>Brand</label>
                        <select class="form-select" {...register('brand', { required: 'Brand is required' })}>
                            <option value="">Select Brand</option>
                            {formdata.carsBrandList?.map((brand, index) => (
                                <option key={index} value={brand.brandName}>
                                    {brand.brandName}
                                </option>
                            ))}
                        </select>
                        {errors.brand && <small className="text-danger">{errors.brand.message}</small>}
                    </div>
                    <div class="mb-3">
                        <label className='form-label'>Model</label>
                        <input type="text" class="form-control" {...register('model', { required: 'Model is required' })} />
                        {errors.model && <small className="text-danger">{errors.model.message}</small>}
                    </div>
                    <div className='d-flex column-gap-3'>
                        <div class="flex-1 mb-3">
                            <label className='form-label'>Year</label>
                            <input type="text" class="form-control" {...register('year', { required: 'Year is required', pattern: { value: /^\d{4}$/, message: 'Please enter a valid year' } })} />
                            {errors.year && <small className="text-danger">{errors.year.message}</small>}
                        </div>
                        <div class="flex-1 mb-3">
                            <label className='form-label'>Car ID</label>
                            <input type="text" class="form-control" {...register('carId', { required: 'Car ID is required' })} />
                            {errors.carId && <small className="text-danger">{errors.carId.message}</small>}
                        </div>
                    </div>
                    <div className='popup-btn'>
                        <button type="submit" class="btn btn-login">{t('UpdateText')}</button>
                        <button type="button" class="btn btn-secondary" onClick={onClose}>{t('cancelText')}</button>
                    </div>
                </form>
            </div>
        </div>
</>
  );
}

EditCarForm.propTypes = {
    dispatch: PropTypes.func,
    data: PropTypes.object,
    loader: PropTypes.bool,
    userDetails: EMPTY_OBJECT,
    carDetailsData: PropTypes.object,
    onUpdate: PropTypes.func,
    onClose: PropTypes.func,

}

EditCarForm.defaulProps = {
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

export default connect(mapStateToProps)(EditCarForm)