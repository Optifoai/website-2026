import React, { useReducer, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { handleDownloadfile, notify } from '../../utils/helpers';
import SelectingCarPlate from './SelectingCarPlate';
import StudioPlateTabs from './StudioPlateTabs';
import { createCarPlate } from '../../Redux/Actions/carAction';
import { useNavigate } from 'react-router-dom';
import LoaderSpiner from '../../hooks/LoaderSpiner';
import CommonModel from '../../components/common/model/CommonModel';
import { useTranslation } from 'react-i18next';

const initialState = {
    carImage: [],
    activeLogoURL: '',
    loader: false,
    formloader: false,
    imageDetails: [],
    downloadUrl: '',
    carCreated: false,
    downloaded: false,
};

function reducer(state, action) {
    return { ...state, ...action };
}

function CreateCarPlateForm(props) {
    const { selectedImages, setSelectedFiles, files = [], dispatch } = props;
    const navigate = useNavigate();
    const [formdata, setFormdata] = useReducer(reducer, initialState);
    const { t } = useTranslation();

    useEffect(() => {
        if (files.length > 0 && formdata.imageDetails.length === 0) {
            setFormdata({ imageDetails: files.map(() => ({ position: '' })) });
        }
    }, [files]);

    /* =======================
       Sync images from redux
    ======================= */
    useEffect(() => {
        if (!selectedImages.length) return;
        setFormdata({ carImage: selectedImages });
    }, [selectedImages]);



    /* =======================
       Save car
    ======================= */
    const saveCarDetails = () => {

        if (!selectedImages?.length) {
            notify('error', 'Please select car image!');
            return;
        }

        if (!formdata?.activeLogoURL) {
            notify('error', 'Please select number Plate!');
            return;
        }

        setFormdata({ formloader: true });

        const formPostData = new FormData();

        formPostData.append('carImages', selectedImages[0]);


        formPostData.append('numberPlateUrl', formdata?.activeLogoURL);


        dispatch(createCarPlate(formPostData)).then(res => {
            if (res?.message && res?.processedS3Url) {
                setFormdata({ formloader: false, carCreated: true, downloadUrl: res?.imageUrl || res?.processedS3Url });
                notify('success', res?.message || 'Car created successfully');
                // navigate('/dashboard');
            } else {
                setFormdata({ formloader: false });
                notify('error', res?.error?.responseMessage || 'Something went wrong');
            }

        })
            .catch(err => {
                notify('error', err?.message || 'Something went wrong');
                setFormdata({ formloader: false });
            })
    };

    const handleDownload = async () => {
        try {
            setFormdata({ downloaded: true });
            const response = await fetch(formdata.downloadUrl);
            const blob = await response.blob();
            if (blob) {
                setFormdata({ downloaded: false });
                handleDownloadfile(blob, 'car-plate-image.png');

            }
        } catch (error) {
            console.error('Download failed:', error);
        }
    };



    const handleGoToNewCar = () => {
        setFormdata({ carCreated: false, activeLogoURL: '', imageDetails: [], downloadUrl: '' });
        setSelectedFiles([]);
        setFormdata(initialState);
        // navigate('/dashboard');
    };


    return (
        <>
            {/* <h4 className="main-heading mt-2 mb-2">Create Car</h4> */}

            {formdata.carCreated ? (
                <div className="text-center text-white py-5">

                    <div className="d-flex justify-content-center mb-4">
                        <div
                            style={{
                                width: "100%",
                                maxWidth: "700px",
                            }}
                        >
                            <img
                                src={
                                    formdata.downloadUrl
                                        ? formdata.downloadUrl
                                        : "/images/car-plate-image.png"
                                }
                                alt="Selected car"
                                className="img-fluid rounded"
                                style={{
                                    width: "100%",
                                    maxHeight: "450px",
                                    objectFit: "contain",
                                }}
                            />
                        </div>
                    </div>

                    <h2>Car Plate Created Successfully!</h2>
                    <p>You can now download the generated image.</p>

                    <button
                        disabled={formdata.downloaded}
                        className="btn btn-secondary me-2"
                        onClick={handleDownload}
                    >
                        {t("DownloadText")}
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={handleGoToNewCar}
                    >
                        Try New Car Plate
                    </button>
                </div>
            ) : (
                <div className="grid_1_3 custom_tab_sections">
                    <StudioPlateTabs
                        formdata={formdata}
                        setFormdata={setFormdata}
                        saveCarDetails={saveCarDetails}
                        dispatch={dispatch}
                    />

                   <div className="text-center">
                  
    <SelectingCarPlate selectedImages={selectedImages} handleGoToNewCar={handleGoToNewCar} />

   
</div>
                </div>
            )}

            <CommonModel show={formdata.formloader} custombg={'visitmodal'} onClose={() => { setFormdata({ formloader: false }) }}>
                <div className='visit-car-image'><img src='/images/visit-car.gif' /></div>
                <h2 className='mt-0'>Glad to have you at Optifo!</h2>
                <p>Please wait, the car is being created and is currently in progress..</p>
            </CommonModel>

        </>
    );
}

/* =======================
   PropTypes
======================= */
CreateCarPlateForm.propTypes = {
    selectedImages: PropTypes.array,
    selectedImages: PropTypes.array,
    files: PropTypes.array,
    dispatch: PropTypes.func,
};

CreateCarPlateForm.defaultProps = {
    selectedImages: [],
    selectedImages: [],
    files: [],
};

function mapStateToProps({ login }) {
    return {
        isUserLogin: login?.isUserLogin,
        userDetails: login?.userDetails,
        loader: login?.loader,
    };
}

export default connect(mapStateToProps)(CreateCarPlateForm);
