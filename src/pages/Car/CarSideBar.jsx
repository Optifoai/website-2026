import React, { useReducer } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { displayDateFormat, EMPTY_OBJECT, notify } from '../../utils/helpers';
import { useTranslation } from 'react-i18next';
import Dropdown from 'react-bootstrap/Dropdown';
// import WebRotate360Viewer from './WebRotate360Viewer';
import WebRotate360Viewer from './WebRotate360Viewer';
import Dropzone from 'react-dropzone';
import CommonModel from '../../components/common/model/CommonModel';
import { Trans } from 'react-i18next';
import { UplpadFileIcon } from '../../components/common/model/svg';
import { generate360ImageAPI, getCarDelete, UploadCarVideoAPIUrl } from '../../Redux/Actions/carAction';
import { useForm } from 'react-hook-form';
import EditCarForm from './EditCarForm';
import { useNavigate } from 'react-router-dom';


function CarSideBar(props) {
    const { t } = useTranslation();
     const navigate = useNavigate();
    const { dispatch, isUserLogin, loader, Link } = props
    const { carDetailsData, actionDownloadModal, getCarData } = props
    // console.log('carDetailsData',carDetailsData)

    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    React.useEffect(() => {
        if (carDetailsData?.carDetails) {
            setValue('brand', carDetailsData.carDetails.carBrand);
            setValue('model', carDetailsData.carDetails.carModel);
            setValue('year', carDetailsData.carDetails.carYear);
            setValue('carId', carDetailsData.carDetails.carId);
        }
    }, [carDetailsData, setValue]);


    const [formdata, setFormdata] = useReducer((state, newState) => ({ ...state, ...newState }),
        {
            uploadVideoModelOpen: false,
            generate360VideoModelOpen: false,
            uploadVideoCar: false,
            challengeImageErrorMsg: '',
            docErrorMsg: '',
            logoImageExtError: true,
            uploadedvideo: '',
            logoUploadSizeError: false,

            editModelOpen: false,
            deleteModelOpen:false


        }
    );

    function generate_360_image() {
        let carVideoLink = carDetailsData?.carDetails?.carVideo && carDetailsData?.carDetails?.carVideo !== '' ? carDetailsData?.carDetails.carVideo : "";
        let payload = {
            "carVideo": carVideoLink,
            "vehicleId": carDetailsData?.carDetails?._id
        };
        dispatch(generate360ImageAPI(payload)).then((res) => {
            if (res?.statusCode == '1') {
                notify('success', res.response?.data?.message ? res.response?.data?.message : 'Video uploaded successfully.');
                setFormdata({ generate360VideoModelOpen: true });
                return true;
            } else {
                notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!');
                setFormdata({ generate360VideoModelOpen: false });
            }
        }).catch((err) => {
            notify('error', err?.message ? err?.message : 'Something went wrong!');
            setFormdata({ generate360VideoModelOpen: false });
        });

    }



    const editInputFeild360Image = (
        <WebRotate360Viewer images={carDetailsData?.carDetails?.carImages} carID={carDetailsData.carDetails._id} car360ImageRes={carDetailsData.car360Image ? carDetailsData.car360Image : '38'} />
    );

    const editCarForm = (
        <EditCarForm carDetailsData={carDetailsData} onClose={() => setFormdata({ editModelOpen: false })} getCarData={getCarData} />
    )

    // 360 function

    const uploadCarVideoBody = (
        <Dropzone
            onDrop={(acceptedFile) => handlCarVideoImage(acceptedFile)}
            maxSize={400000000}
        >
            {({ getRootProps, getInputProps }) => (
                <>
                    {formdata.uploadVideoCar ? (
                        <div>
                            <p>Video Selected</p>
                            <video id="videoPreview" width="400" controls></video>
                            {/* <img src={formdata.uploadVideoCar} alt="" className="w-100" /> */}
                            <div className="text-right mt-2">
                                {/* <button
                                    className="btn btn-white px-3 py-2"
                                    onClick={AgainVideoUpload}
                                >
                                    {t('cancel_text')}
                                </button> */}
                                {/* <button
                                    className="btn btn-black px-3 py-2 ml-2"
                                    onClick={uploadCarVideo}
                                >
                                    {t('upload_text')}
                                </button> */}
                            </div>
                        </div>
                    ) : (
                        <div className="upload_file_main">
                            <div className="upload_file h-100" {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div className="d-flex align-items-center justify-content-center h-100 text-center">
                                    <div>
                                        <UplpadFileIcon />
                                        <p className="mb-0">
                                            {t('drag_drop')}{' '}
                                            <strong className="text-decoration-underline">
                                                {t('upload_fr_computer')}
                                            </strong>
                                        </p>
                                        {/* <p className="small mb-2">NOTE: Recommended height 140 pixels</p> */}
                                        <div>
                                            <small className="text-red">
                                                {formdata.logoUploadSizeError
                                                    ? `${t('valid_video_size')}`
                                                    : ''}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <small className="text-red">
                            {formdata.logoImageExtError ? `${t('allowed_video')}` : ''}
                        </small>
                    </div>
                </>
            )}
        </Dropzone>
    );

    const uploadCarVideo = (e) => {
        let formPostData = new FormData();
        formPostData.append('carVideo', formdata.uploadedvideo); // The file object
        formPostData.append('vehicleId', carDetailsData.carDetails._id);

        dispatch(UploadCarVideoAPIUrl(formPostData)).then((res) => {
            if (res?.statusCode == '1') {
                notify('success', res.response?.data?.message ? res.response?.data?.message : 'Video uploaded successfully.');
                setFormdata({ uploadVideoModelOpen: false });
                getCarData()
                return true;
            } else {
                notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!');
                setFormdata({ uploadVideoModelOpen: false });
            }
        }).catch((err) => {
            notify('error', err?.message ? err?.message : 'Something went wrong!');
            setFormdata({ uploadVideoModelOpen: false });
        });
    };

    // const AgainVideoUpload = () => {
    //     setFormdata({
    //         ...formdata,
    //         uploadBg: '',
    //         challengeImageErrorMsg: '',
    //         docErrorMsg: '',
    //         uploadVideoCar: false,
    //     });
    // };  

    const handlCarVideoImage = async (droppedFile) => {

        let reader = new FileReader();
        let img = new Image(droppedFile);
        let fileLogo = droppedFile[0];

        let logoIdxDot = fileLogo.name.lastIndexOf('.') + 1;
        let logoExtFile = fileLogo.name
            .substr(logoIdxDot, fileLogo.name.length)
            .toLowerCase();
        // console.log('logoExtFile',logoExtFile)  
        if (logoExtFile == 'mp4' || logoExtFile == 'mov') {
            const image = fileLogo

            if (image) {

                reader.addEventListener(
                    'load',
                    () => {
                        setFormdata({
                            uploadVideoCar: reader.result,
                            uploadedvideo: fileLogo, // Store the file object here
                            challengeImageErrorMsg: '',
                            docErrorMsg: '',
                            logoUploadSizeError: false,
                            logoImageExtError: false,
                        });

                    },
                    false
                );
                if (image) {
                    reader.readAsDataURL(fileLogo);
                }
            } else {
                setFormdata({
                    ...formdata,
                    logoUploadSizeError: true,
                    uploadVideoCar: '',
                    challengeImageErrorMsg: '',
                    docErrorMsg: '',
                });
            }
        } else {
            setFormdata({
                ...formdata,
                uploadVideoCar: '',
                challengeImageErrorMsg: '',
                docErrorMsg: '',
                logoImageExtError: true,
            });
        }
    };


      const actionDelteModal = () => {
              let payLoad = {
                vehicleId:  carDetailsData.carDetails._id,
                };
             dispatch(getCarDelete(payLoad)).then((res) => {
                if (res?.statusCode == '1') {
                    getCarData()
                    notify('success', res.response?.data?.message ? res.response?.data?.message : 'Car deleted successful.')
                    setFormdata({ deleteModelOpen: false });
                    navigate('/dashboard');                   
                    
                } else {
                    notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!')
                }
            }).catch((err) => {
                notify('error', err?.message ? err?.message : 'Something went wrong!')
            });
            setFormdata({ deleteModelOpen: false });
            
        }

    console.log('carDetailsData', carDetailsData)
    return (
        <>

            <div className='car-details'>
                <h2 class="">{carDetailsData?.carDetails?.carModel}</h2>

                <div class="info-block">
                    <p class="label">Brand</p>
                    <p class="value">{carDetailsData?.carDetails?.carBrand}</p>
                </div>

                <div class="info-block">
                    <p class="label">Year</p>
                    <p class="value">{carDetailsData?.carDetails?.carYear}</p>
                </div>

                <div class="info-block">
                    <p class="label">Card Id</p>
                    <p class="value">{carDetailsData?.carDetails?.carId}</p>
                </div>

                <div class="info-block">
                    <p class="label">Created</p>
                    <p class="value">{carDetailsData?.carDetails?.created ? displayDateFormat(carDetailsData?.carDetails?.created) : '-'}</p>
                </div>
                {/* 360 creation flow */}
                <div class="justify-content-between">
                    {carDetailsData?.carDetails?.carVideo == '' ?
                        <button type='button' class="small-btn" onClick={() => { setFormdata({ uploadVideoModelOpen: true }); }}><img src='../download.svg' />  {t('upload_video_text')}</button>
                        : <button type='button' class="small-btn" onClick={generate_360_image}><img src='../download.svg' /> {t('generate_image_text')}</button>}
                </div>

                {/* AI video creation flow */}
                <div class="justify-content-between">

                    <button type='button' class="small-btn" onClick={() => { setFormdata({ uploadVideoModelOpen: true }); }}><img src='../download.svg' /> {t('generate_ai_image')}</button>

                </div>


                <div class="d-flex btn-download justify-content-between">


                    <button type='button' class="small-btn" onClick={actionDownloadModal}><img src='../download.svg' /> {carDetailsData?.selectedImage?.length > 0 ? `${t('DownloadText')} (${carDetailsData?.selectedImage?.length})` : t('DownloadAllText')}</button>

                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic" className="small-btn">
                            <img src="../three-dots.png" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setFormdata({ deleteModelOpen: true })}>Delete Car</Dropdown.Item>
                            <Dropdown.Item onClick={() => setFormdata({ editModelOpen: true })}>Edit Car Info</Dropdown.Item>
                            <Dropdown.Item >Remove Background Image</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                </div>
            </div>

            {/* car video upload model for 360 */}
            <CommonModel show={formdata.uploadVideoModelOpen} onClose={() => { setFormdata({ uploadVideoModelOpen: false }) }}>
                {uploadCarVideoBody}
                <div className="popup-btn">
                    <button type="button" className="btn btn-login" onClick={uploadCarVideo}>{t('upload_video_text')}</button>
                    <button type="button" className="btn btn-secondary" onClick={() => { setFormdata({ uploadVideoModelOpen: false }); }}>{t('cancelText')}</button>
                </div>
            </CommonModel>

            {/* car generate 360 video model */}
            <CommonModel show={formdata.generate360VideoModelOpen} onClose={() => { setFormdata({ generate360VideoModelOpen: false }) }}>
                {editInputFeild360Image}
            </CommonModel>

            {/* car Edit downlaod model */}
            <CommonModel show={formdata.editModelOpen} onClose={() => { setFormdata({ editModelOpen: false }) }}>

                {editCarForm}


            </CommonModel>

            {/* car delete model */}
            <CommonModel show={formdata.deleteModelOpen} onClose={() => { setFormdata({ deleteModelOpen: false }) }}>

            <img src="/delete-image.png" />
            <h2>{t('deleteText')} {formdata?.actionCarDetails?.carType}?</h2>
            <Trans i18nKey="deleteCarMsgText">
                Do you really want to delete this car from your Optifo list?
            </Trans>
            <div className="popup-btn">
                <button type="button" className="btn btn-login" onClick={actionDelteModal}>{t('deleteText')}</button>
                <button type="button" className="btn btn-secondary" onClick={ () => {setFormdata({ deleteModelOpen: false });}}>{t('cancelText')}</button>
            </div>


            </CommonModel>

        </>
    );
}

CarSideBar.propTypes = {
    dispatch: PropTypes.func,
    data: PropTypes.object,
    loader: PropTypes.bool,
    userDetails: EMPTY_OBJECT,

}

CarSideBar.defaulProps = {
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

export default connect(mapStateToProps)(CarSideBar)