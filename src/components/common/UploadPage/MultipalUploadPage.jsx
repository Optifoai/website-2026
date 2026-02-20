import React, { useEffect, useReducer, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { UplpadFileIcon } from '../model/svg.jsx';
import { EMPTY_ARRAY, EMPTY_OBJECT, notify } from '../../../utils/helpers';

function MultipalUploadPage(props) {
const {cancelBtn,formdata,UploadDone,setFormdata,onClose,acceptfile,fileNote,fileIntructions,isValidDimensions,width,height,fileSize, onFileSelect, multiple} = props;

const { t, i18n } = useTranslation();

 function imageDimensions(file) {
       return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const {naturalWidth: width, naturalHeight: height} = img;
                resolve({width, height});
            };
            img.onerror = () => {
                reject(`${t('problem_with_image')}`);
            };
            img.src = URL.createObjectURL(file);
        });
    }

 async function handleUploadImage(droppedFile) {
        if (onFileSelect) {
            onFileSelect(droppedFile);
            return;
        }

       let reader = new FileReader();
        let img = new Image(droppedFile);
        let file = droppedFile[0];
        let idxDot = file.name.lastIndexOf('.') + 1;
        let extFile = file.name.substr(idxDot, file.name.length).toLowerCase();
        // if (extFile == 'jpg' || extFile == 'jpeg' || extFile == 'png') {
        if (acceptfile.includes(extFile )) {

            try {
                const dimensions = await imageDimensions(file);
                if ((isValidDimensions && dimensions.width == width && dimensions.height == height) || !isValidDimensions ) {
                    reader.addEventListener(
                        'load',
                        () => {
                            setFormdata({
                                ...formdata,
                                uploadImageUrl: reader.result,
                                challengeImageErrorMsg: '',
                                docErrorMsg: '',
                                UploadSizeError: false,
                                ImageExtError: false,
                            });
                        },
                        false
                    );
                    if (file) {
                        reader.readAsDataURL(file);                       
                        // console.log('upload file',file)
                        setFormdata({uploadedfile: file})
                    }
                } else {
                    setFormdata({
                        ...formdata,
                        uploadImageUrl: '',
                        challengeImageErrorMsg: '',
                        docErrorMsg: '',
                        UploadSizeError: true,
                    });
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setFormdata({
                ...formdata,
                uploadImageUrl: '',
                challengeImageErrorMsg: '',
                docErrorMsg: '',
                ImageExtError: true,
            });
        }
    }

      function AgainUpload() {
        setFormdata({
            ...formdata,
            uploadImageUrl: '',
            challengeImageErrorMsg: '',
            docErrorMsg: '',
            UploadSizeError: false,

        });
    }

    const closeModel=()=>{       
         setFormdata({
            ...formdata,
            uploadImageUrl: '',
            challengeImageErrorMsg: '',
            docErrorMsg: '',
            UploadSizeError: false,
        });
         onClose()
}

    
// console.log('formdata uploadedfile 2',formdata.uploadedfile)

    return (
        <>
            <section class="card-block" aria-label="Preview Card">
                <Dropzone
                    onDrop={(acceptedFiles) => handleUploadImage(acceptedFiles)}
                    maxSize={fileSize ? parseInt(fileSize, 10) : undefined}
                    multiple={multiple}
                >
                    {({ getRootProps, getInputProps }) => (
                        <>
                            {formdata?.uploadImageUrl ? (
                                <div>
                                    <img src={formdata?.uploadImageUrl} alt="" className="w-100" />
                                    <div className="text-right mt-2">
                                        <button  className="btn btn-login" onClick={AgainUpload}>
                                            {t('change_img')}
                                        </button>
                                        {UploadDone && (
                                            <button className="btn btn-login  mt-2" onClick={UploadDone}>
                                                {t('ok_text')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="upload_file_main">
                                    <div className="upload_file h-100" {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <div
                                            className="d-flex align-items-center justify-content-center h-100 text-center">
                                            <div>
                                                <UplpadFileIcon />
                                                <p className="mt-2 mb-2">
                                                    {t('drag_drop')}{' '}
                                                    <strong className="text-decoration-underline">
                                                        {t('upload_fr_computer')}
                                                    </strong>
                                                </p>
                                                <p className="small mb-2">
                                                   {fileNote}
                                                </p>
                                                <p className="small">
                                                    {fileIntructions}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div>
                                <small className="text-danger">
                                    {formdata?.UploadSizeError ? `${t('valid_imge_size')}` : ''}
                                </small>
                            </div>
                            <div>
                                <small className="text-danger">
                                    {formdata?.ImageExtError ? `${t('only_text')} ${ acceptfile.join(', ')} ${t('allow_text')}`  : ''}
                                </small>
                            </div>
                        </>
                    )}
                </Dropzone>

                {cancelBtn ?<div className="popup-btn">                   
                    <button type="button" className="btn btn-secondary" onClick={closeModel}> {t('cancel_text')}</button>
                </div>:null}

            </section>
        </>
    );
}

MultipalUploadPage.propTypes = {
    dispatch: PropTypes.func,
    data: PropTypes.object,
    loader: PropTypes.bool,
    userDetails: EMPTY_OBJECT,
    onFileSelect: PropTypes.func,
    multiple: PropTypes.bool,
    cancelBtn: PropTypes.bool,
    isValidDimensions: PropTypes.bool,




}

MultipalUploadPage.defaulProps = {
    dispatch: PropTypes.func,
    data: EMPTY_OBJECT,
    userDetails: EMPTY_OBJECT,
    loader: PropTypes.bool,
    onFileSelect: null,
    multiple: false,
    cancelBtn:true,
    isValidDimensions:true

}

function mapStateToProps({ login }) {
    return {
        isUserLogin: login?.isUserLogin,
        userDetails: login?.userDetails,
        loader: login?.loader
    }
}

export default connect(mapStateToProps)(MultipalUploadPage)