import React, { useReducer, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { EMPTY_OBJECT } from '../../utils/helpers';
import CommonModel from '../../components/common/model/CommonModel';

import CreateCarForm from './CreateCarForm';
import MultipalUploadPage from '../../components/common/UploadPage/MultipalUploadPage';

function CreateCar(props) {
    const [formdata, setFormdata] = useReducer((state, newState) => ({ ...state, ...newState }),
        {
            addModalOpen: false,
            uploadedfile: null,
        }
    );
    const [selectedFiles, setSelectedFiles] = useState({ files: [], urls: [] });
    const [isModalClosed, setIsModalClosed] = useState(true);

    function onFileSelect(files) {
        if (files && files.length > 0) {
            const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
            setSelectedFiles({ files: files, urls: imageUrls });
            setIsModalClosed(false); // We are about to close the modal
        }
        setFormdata({ addModalOpen: false });
    }

    function onModalClose() {
        setFormdata({ addModalOpen: false });
        if (selectedFiles.files.length > 0) {
            setIsModalClosed(true); // Now the modal is closed, we can render the form
        }
    }

    const { addModalOpen } = formdata;

    // if (selectedFiles?.files?.length > 0 && isModalClosed) {
    if (selectedFiles?.files?.length > 0) {
        return <CreateCarForm
            selectedImages={selectedFiles.files}
            files={selectedFiles.files}
            setSelectedFiles={setSelectedFiles}
        />;
    }

    return (
        <>
            {/* <div className='bg-logo-blk'> 
            <div class="card add-card">
              <div class="add-content" onClick={()=>{setFormdata({addModalOpen :true})}}>
                <div class="add-icon"><img src='/images/add-icon.svg' /></div>
                <p>Add Car Image </p>
              </div>
            </div>
        </div> */}
            <div style={{ display: 'block'}}
            >
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content">
                        <div className="modal-body custom-modal-body">
                            <MultipalUploadPage
                                // fileNote={'NOTE: Background size 1600 x 1200 pixels'}
                                //   fileIntructions={'(Wall height 600 pixels + floor height 600 pixels)'} 
                                fileIntructions=''
                                onFileSelect={onFileSelect}
                                formdata={formdata}
                                setFormdata={setFormdata}
                                onClose={onModalClose}
                                acceptfile={['jpg', 'jpeg', 'png']}
                                width={'1600'}
                                height={'1200'}
                                fileSize={'400000000'}
                                isValidDimensions={false}
                                multiple={true}
                                cancelBtn={false}
                            /> 
                             </div></div> 
                              </div> </div>

            {/* <CommonModel show={addModalOpen} size="modal-xl" onClose={onModalClose}>
            <MultipalUploadPage 
              fileNote={'NOTE: Background size 1600 x 1201 pixels'}
            //   fileIntructions={'(Wall height 600 pixels + floor height 600 pixels)'} 
            fileIntructions=''
              onFileSelect={onFileSelect}
              formdata={formdata} 
              setFormdata={setFormdata}
              onClose={onModalClose}
              acceptfile={['jpg', 'jpeg', 'png']}
              width={'1600'}
              height={'1200'}
              fileSize={'400000000'}
              isValidDimensions={false}
              multiple={true}
              />                               
        </CommonModel> */}
        </>
    );
}

CreateCar.propTypes = {
    loader: PropTypes.bool,
    userDetails: EMPTY_OBJECT,
}

CreateCar.defaulProps = {
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

export default connect(mapStateToProps)(CreateCar)