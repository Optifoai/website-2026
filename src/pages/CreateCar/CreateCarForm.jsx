import React, { useReducer, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { notify, parseCarCreateResponse } from '../../utils/helpers';
import { setPendingCarJobId, setPendingVehicleId } from '../../utils/carJobStorage';
import SelectedCarImage from './SelectedCarImage';
import StudioTabs from './StudioTabs';
import { createCarSave, getCarDetails, updateCar } from '../../Redux/Actions/carAction';
import { useNavigate } from 'react-router-dom';
import CommonModel from '../../components/common/model/CommonModel';

const initialState = {
    carType: '',
    carBrand: '',
    carYear: '',
    carModel: '',
    carId: '',
    carColor: '',
    carImage: [],
    caruploadName: [],
    carImagesPosNames: [],
    dataImage: [],
    backgroundURL: '',
    activeLogoURL: '',
    activeBannerURL: '',
    loader: false,
    formloader: false,
    uploadProgress: 0,
    imageDetails: [],
};

function reducer(state, action) {
    return { ...state, ...action };
}

function CreateCarForm(props) {
    const { selectedImages, setSelectedFiles, dispatch, vehicleId, userDetails } = props;
    const navigate = useNavigate();
    const [formdata, setFormdata] = useReducer(reducer, initialState);
    const formdataRef = useRef(formdata);
    formdataRef.current = formdata;

    useEffect(() => {
        if (!selectedImages.length) return;

        const prev = formdataRef.current;
        const dataImage = selectedImages.map((img, index) => ({
            img: selectedImages[index],
            position: prev.dataImage[index]?.position || '',
        }));

        setFormdata({
            carImage: selectedImages,
            caruploadName: selectedImages,
            dataImage,
        });
    }, [selectedImages]);

    useEffect(() => {
        if (vehicleId) {
            dispatch(getCarDetails(vehicleId)).then((res) => {
                if (res?.statusCode == '1') {
                    const carData = res?.responseData;
                    setFormdata({
                        carType: carData?.carType || '',
                        carBrand: carData?.carBrand || '',
                        carYear: carData?.carYear || '',
                        carModel: carData?.carModel || '',
                        carId: carData?.carId || 'k',
                        carColor: carData?.carColor || '',
                        backgroundURL: carData?.backgroundURL || '',
                        activeLogoURL: carData?.numberPlateUrl || '',
                        activeBannerURL: carData?.bannerUrl || '',
                    });
                }
            });
        }
    }, [vehicleId, dispatch]);

    const handleImagePositionChange = (e, index) => {
        const value = e.target.value;

        const newDataImage = [...formdata.dataImage];
        newDataImage[index] = {
            ...newDataImage[index],
            position: value,
            img: selectedImages[index],
        };

        const newPosNames = [...formdata.carImagesPosNames];
        if (value) {
            newPosNames[index] = value;
        } else {
            newPosNames.splice(index, 1);
        }

        setFormdata({
            dataImage: newDataImage,
            carImagesPosNames: newPosNames,
        });
    };

    const updateCarImage = (file) => {
        const carpos = [...selectedImages];
        file.every((f) => carpos?.push(f));
        setSelectedFiles({ files: carpos });
    };

    const handleDeleteCar = (e, index) => {
        const carpos = [...selectedImages];
        const dataImageRes = [...formdata?.dataImage];
        const carImagesPosNames = [...formdata?.carImagesPosNames];
        carpos?.splice(index, 1);
        dataImageRes.splice(index, 1);
        carImagesPosNames.splice(index, 1);
        setSelectedFiles({ files: carpos });
        setFormdata({ dataImage: dataImageRes, carImagesPosNames });
    };

    const handleCreateSuccess = (res) => {
        const parsed = parseCarCreateResponse(res);

        if (parsed?.success || parsed?.isAsyncJob) {
            const message =
                parsed?.message ||
                (parsed?.isAsyncJob
                    ? 'Car has been queued for processing.'
                    : 'Car created successfully');

            if (parsed?.isAsyncJob && parsed?.jobId) {
                setPendingCarJobId(parsed.jobId);
            }
            if (parsed?.vehicleId) {
                setPendingVehicleId(parsed.vehicleId);
            }

            notify('success', message);
            navigate('/dashboard');
            return;
        }

        notify('error', res?.error?.responseMessage || 'Something went wrong');
    };

    const saveCarDetails = () => {
        const isValid = formdata?.dataImage.filter((item) => item.position == '');
        if (
            formdata?.dataImage.length < 1 ||
            formdata.dataImage.length !== selectedImages.length ||
            isValid.length > 0
        ) {
            notify('error', 'Please select car position!');
            return;
        }

        if (!selectedImages?.length) {
            notify('error', 'Please select car image!');
            return;
        }

        const hasInvalidFiles = formdata.dataImage.some(
            (item) => !(item?.img instanceof File || item?.img instanceof Blob)
        );
        if (hasInvalidFiles) {
            notify('error', 'Invalid image files. Please re-upload your car images.');
            return;
        }

        if (!formdata.carType || !formdata.carId || !formdata.carBrand) {
            notify('error', 'Please fill required (*)');
            return;
        }

        if (!formdata?.backgroundURL) {
            notify('error', 'Please select background!');
            return;
        }

        if (formdata?.formloader) {
            return;
        }

        setFormdata({ formloader: true, uploadProgress: 0 });

        const formPostData = new FormData();

        formdata.dataImage.forEach((item) => {
            formPostData.append('carImages', item.img);
        });

        const positions = formdata?.dataImage.map((item) => item.position);

        formPostData.append('carType', formdata?.carType);
        formPostData.append('carYear', formdata?.carYear);
        formPostData.append('carColor', formdata?.carColor);
        formPostData.append('carId', formdata?.carId);
        formPostData.append('carBrand', formdata?.carBrand);
        formPostData.append('carModel', formdata?.carModel);
        formPostData.append('backgroundURL', formdata?.backgroundURL);
        formPostData.append('numberPlateUrl', formdata?.activeLogoURL || '');
        formPostData.append('bannerUrl', formdata?.activeBannerURL || '');
        formPostData.append('carImagesNames', JSON.stringify(positions));

        if (vehicleId) {
            formPostData.append('vehicleId', vehicleId);
            dispatch(updateCar(formPostData, vehicleId))
                .then((res) => {
                    setFormdata({ formloader: false });
                    if (res?.statusCode == '1' || res?.message) {
                        notify('success', res?.message || 'Car updated successfully');
                        navigate('/dashboard');
                    } else {
                        notify('error', res?.error?.responseMessage || 'Something went wrong');
                    }
                })
                .catch((err) => {
                    notify('error', err?.error?.responseMessage || err?.message || 'Something went wrong');
                    setFormdata({ formloader: false });
                });
        } else {
            dispatch(
                createCarSave(formPostData, {
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const pct = Math.round(
                                (progressEvent.loaded * 100) / progressEvent.total
                            );
                            setFormdata({ uploadProgress: pct });
                        }
                    },
                })
            )
                .then((res) => {
                    setFormdata({ formloader: false, uploadProgress: 0 });
                    handleCreateSuccess(res);
                })
                .catch((err) => {
                    const apiError =
                        err?.error ||
                        err?.message ||
                        err?.error?.responseMessage ||
                        'Something went wrong';
                    notify('error', apiError);
                    setFormdata({ formloader: false, uploadProgress: 0 });
                });
        }
    };

    return (
        <>
            <div className="grid_1_3 custom_tab_section">
                <StudioTabs
                    formdata={formdata}
                    setFormdata={setFormdata}
                    saveCarDetails={saveCarDetails}
                    dispatch={dispatch}
                    userDetails={userDetails}
                    vehicleId={vehicleId || ''}
                    isSaving={formdata?.formloader}
                />

                <SelectedCarImage
                    selectedImages={selectedImages}
                    imageDetails={formdata.dataImage}
                    handleImagePositionChange={handleImagePositionChange}
                    handleDeleteCar={handleDeleteCar}
                    updateCarImage={updateCarImage}
                />
            </div>

            <CommonModel
                show={formdata.formloader && !vehicleId}
                custombg={'visitmodal'}
                onClose={() => {
                    setFormdata({ formloader: false, uploadProgress: 0 });
                }}
            >
                <div className="visit-car-image">
                    <img src="/images/visit-car.gif" alt="Uploading car" />
                </div>
                <h2 className="mt-0">Glad to have you at Optifo!</h2>
                <p>Please wait, uploading your car images...</p>
                <div className="progress mb-3" style={{ height: '8px' }}>
                    <div
                        className="progress-bar bg-success"
                        style={{
                            width: `${formdata.uploadProgress || 0}%`,
                            transition: 'width 0.2s ease',
                        }}
                    />
                </div>
                <p className="small text-muted mb-0">
                    {formdata.uploadProgress || 0}% uploaded
                </p>
            </CommonModel>
        </>
    );
}

CreateCarForm.propTypes = {
    selectedImages: PropTypes.array,
    files: PropTypes.array,
    dispatch: PropTypes.func,
    vehicleId: PropTypes.string,
    userDetails: PropTypes.object,
};

CreateCarForm.defaultProps = {
    selectedImages: [],
    files: [],
    vehicleId: '',
    userDetails: {},
};

function mapStateToProps({ login }) {
    return {
        isUserLogin: login?.isUserLogin,
        userDetails: login?.userDetails,
        loader: login?.loader,
    };
}

export default connect(mapStateToProps)(CreateCarForm);
