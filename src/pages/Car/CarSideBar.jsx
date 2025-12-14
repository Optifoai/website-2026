import React, { useEffect, useReducer } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { displayDateFormat, EMPTY_ARRAY, EMPTY_OBJECT, notify } from '../../utils/helpers';
import { useTranslation } from 'react-i18next';
import Dropdown from 'react-bootstrap/Dropdown';
// import WebRotate360Viewer from './WebRotate360Viewer';
import WebRotate360Viewer from './WebRotate360Viewer';
import Dropzone from 'react-dropzone';
import CommonModel from '../../components/common/model/CommonModel';
import { Trans } from 'react-i18next';
import { AddIcon, DownloadIcon, DownloadVideo, UplpadFileIcon } from '../../components/common/model/svg';
import { generate360ImageAPI, generateAImageAPI, getBrandList, getCarBrandList, getCarDelete, updateCarDetails, UploadCarVideoAPIUrl } from '../../Redux/Actions/carAction';
import { useForm } from 'react-hook-form';
import EditCarForm from './EditCarForm';
import { useNavigate } from 'react-router-dom';
import LoaderSpiner from '../../hooks/LoaderSpiner';


function CarSideBar(props) {
    const { t } = useTranslation();
     const navigate = useNavigate();
    const { dispatch, isUserLogin, loader, Link } = props
    const { carDetailsData, actionDownloadModal, getCarData } = props

    const { register, handleSubmit, formState: { errors }, setValue } = useForm();




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
            deleteModelOpen:false,
            carsBrandList: [],
            loader: false,
            closeAIVideo:false,




        }
    );

    function generate_360_image() {
       setFormdata({ loader: true });
        let carVideoLink = carDetailsData?.carDetails?.carVideo && carDetailsData?.carDetails?.carVideo !== '' ? carDetailsData?.carDetails.carVideo : "";
        let payload = {
            "carVideo": carVideoLink,
            "vehicleId": carDetailsData?.carDetails?._id
        };
        dispatch(generate360ImageAPI(payload)).then((res) => {
            setFormdata({ loader: false });
            if (res?.statusCode == '1') {
                notify('success', res.responseData?.message ? res.responseData?.message : '360 Video Generated successfully.');
                setFormdata({ generate360VideoModelOpen: true });
                return true;
            } else {
                notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!');
                setFormdata({ generate360VideoModelOpen: false });
            }
        }).catch((err) => {
            setFormdata({ loader: false });
            notify('error', err?.message ? err?.message : 'Something went wrong!');
            setFormdata({ generate360VideoModelOpen: false });
        });

    }



    const editInputFeild360Image = (
        <WebRotate360Viewer images={carDetailsData?.carDetails?.carImages} carID={carDetailsData.carDetails._id} car360ImageRes={carDetailsData.car360Image ? carDetailsData.car360Image : '38'} />
    );

    const editCarForm = (
        <EditCarForm carsBrandList={formdata.carsBrandList} carDetailsData={carDetailsData} onClose={() => setFormdata({ editModelOpen: false })} getCarData={getCarData} />
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


     const updateAIvideoInfo = (data) => {
        let responcePreviousData=data 
         let formPostData = {
                vehicleId: carDetailsData?.carDetails?._id,
                aIVideoUrl: responcePreviousData?.s3_url
               
            };

             dispatch(updateCarDetails(formPostData)).then((res) => {
            if (res?.statusCode == '1') {
                notify('success', res.response?.data?.message ? res.response?.data?.message : 'Video uploaded successfully.');
                setFormdata({ closeAIVideo: false });
                getCarData()                
            } else {
                notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!');
                setFormdata({ closeAIVideo: false });
            }
        }).catch((err) => {
            notify('error', err?.message ? err?.message : 'Something went wrong!');
            setFormdata({ closeAIVideo: false });
        });

        
    }

    const UpdateCarAIImageInfo = (e) => {
        setFormdata({ loader: true })
        e.preventDefault();
        let selectedImage=carDetailsData?.carDetails?.backgroundRemoveImages3Url
        if(selectedImage?.length>0){           
            let formPostData = {             
                image_urls: selectedImage,                
                text_data: [formdata.aiVideoImageInfo],
               
            };

             dispatch(generateAImageAPI(formPostData)).then((res) => {
                setFormdata({ loader: false })
            if (res?.status == 'success') {
                 updateAIvideoInfo(res)            
            } else {
                notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!');
                setFormdata({ closeAIVideo: false });
            }
        }).catch((err) => {
            notify('error', err?.message ? err?.message : 'Something went wrong!');
            setFormdata({ closeAIVideo: false });
        });    
           
        }else{
           
         notify('error',  'No Image Selected');
        
        
        }
        
   
      
    };

    const changeInputValue = (e) => {
        setFormdata({
            ...formdata,
            [e.target.name]: e.target.value,
        });
     
    };

    const uploadAIVideoBody = (
        <>
          <div class="flex-1 mb-3">
                            <label className='form-label'>Car Info</label>
                            <input type="text" class="form-control"  name="aiVideoImageInfo"
                          value={formdata.aiVideoImageInfo}
                              onChange={(e) => changeInputValue(e)} />
                           
                        </div></>
    )

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

      useEffect(() => {
                getCarBrand()
            }, [EMPTY_ARRAY])

      const getCarBrand = () => {
                dispatch(getBrandList()).then((res) => {

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

          function download_ai_video() {
          if (!carDetailsData?.carDetails?.aIVideoUrl) {
                    throw new Error('Resource URL not provided! You need to provide one');
                }
                fetch(carDetailsData?.carDetails?.aIVideoUrl)
                    .then((response) => response.blob())
                    .then((blob) => {
                        const blobURL = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = carDetailsData?.carDetails?.aIVideoUrl;
                        a.style = 'display: none';
                        a.click();
                    });
  
    }

    function generate_ai_video(vehicleId, carDetails) {
         setFormdata({
            modalYear: carDetailsData.year,
            aiVideoImageInfo: carDetailsData.aiVideoImageInfo,
        });
        setFormdata({...carDetailsData , closeAIVideo: true});
    }

       const showDownloadAll = (items) => {
        var date = new Date();
        let todaysInterval = date.setTime(date.getTime());
        todaysInterval = Math.floor(todaysInterval / 1000)

        let difference = items.videoUploadDate - todaysInterval
        let daysLef = 0
        daysLef = Math.floor(difference / 86400);
        return daysLef
    }
   
       function downloadVideo(index, items, type) {
        setFormdata({ loader: true });
        let links = [];

        setFormdata({ loader: false });
        var link = document.createElement('a');
        link.download = items.carVideo;

        link.href = items.carVideo;
        document.body.appendChild(link);
        link.click();
        // });
        setFormdata({ downloadAll: false });
    }


   
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
                  {/* video */}
                   {carDetailsData?.carDetails && carDetailsData?.carDetails.carVideo ?
                            <div className="btn btn-gray boxdesignbox w-100 text-uppercase w-100">
                                <div class="wrap">
                                    <div class="first">
                                        <DownloadVideo />

                                    </div>
                                    <div class="second text-left ml-1">
                                        <h6>Video available</h6>
                                        <span>{showDownloadAll(carDetailsData?.carDetails)} days left to download video</span>
                                    </div>
                                </div>

                                <button
                                    disabled={formdata?.loader}
                                    className="btn btn-primary small-btn"
                                    onClick={() =>
                                        downloadVideo(carDetailsData?.carDetails?._id, carDetailsData?.carDetails)
                                    } target="_blank">
                                    Download video
                                </button>
                            </div>

                            : ''}
                {/* 360 creation flow */}
                <div class="justify-content-between">
                    {carDetailsData?.carDetails?.carVideo == '' ?
                        <button type='button' class="btn btn-primary small-btn" onClick={() => { setFormdata({ uploadVideoModelOpen: true }); }}><img src='../download.svg' />  {t('upload_video_text')}</button>
                        : <button type='button' class="btn btn-primary small-btn" onClick={generate_360_image}><img src='../download.svg' /> {t('generate_image_text')}</button>}
                </div>

                {/* AI video creation flow */}
                {carDetailsData?.carDetails?.aIVideoUrl && carDetailsData?.carDetails?.aIVideoUrl!=''?
                           
                <button  className={`btn btn-primary small-btn`}
                    onClick={() => download_ai_video()}
                    >
                    <DownloadIcon /> {t('download_ai_image')}
                </button>:
                    <button className={`btn btn-primary small-btn`}
                    onClick={() => generate_ai_video(carDetailsData?.carDetails?._id, carDetailsData?.carDetails)}
                    >
                    <AddIcon /> {t('generate_ai_image')}
                </button>
                }
            
                {/* <div class="justify-content-between">

                    <button type='button' class="small-btn" onClick={() => { setFormdata({ uploadVideoModelOpen: true }); }}><img src='../download.svg' /> {t('generate_ai_image')}</button>

                </div> */}


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
            {formdata?.loader ? <LoaderSpiner /> :<CommonModel show={formdata.generate360VideoModelOpen}  size="modal-xl" onClose={() => { setFormdata({ generate360VideoModelOpen: false }) }}>
                {editInputFeild360Image}
                 <button type="button" className="btn btn-secondary" onClick={() => { setFormdata({ generate360VideoModelOpen: false }); }}>{t('cancelText')}</button>
            </CommonModel>}

             {/* car AI video model */}
            <CommonModel show={formdata.closeAIVideo} onClose={() => { setFormdata({ closeAIVideo: false }) }}>
                {uploadAIVideoBody}
                <div className="popup-btn">
                    <button type="button" className="btn btn-login" disabled={formdata?.loader} onClick={UpdateCarAIImageInfo}>{t('upload_video_text')}</button>
                    <button type="button" className="btn btn-secondary" onClick={() => { setFormdata({ closeAIVideo: false }); }}>{t('cancelText')}</button>
                </div>
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