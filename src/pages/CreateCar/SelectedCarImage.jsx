import React, { useReducer, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { carPositions, EMPTY_OBJECT } from '../../utils/helpers';
import { DeleteIcon } from '../../components/common/model/svg';
import CommonModel from '../../components/common/model/CommonModel';
import MultipalUploadPage from '../../components/common/UploadPage/MultipalUploadPage';

function SelectedCarImage(props) {
    const { selectedImages, imageDetails, handleImagePositionChange, handleDeleteCar, updateCarImage } = props;


    const [formdata, setFormdata] = useReducer(
        (state, newState) => ({ ...state, ...newState }),
        {
            carImage: props && props?.propData && props?.propData?.caruploadName ? props?.propData?.caruploadName : [],
            loadData: false,
            uploadcar: true,
            logoUploadSizeError: false,
            logoImageExtError: false,
            modalCarDefault: false,
            addModalOpen: false,
        }
    );
    const [selectedFiles, setSelectedFiles] = useState({ files: [], urls: [] });
    const [isModalClosed, setIsModalClosed] = useState(true);

    // function onFileSelect(files) {
    //     if (files && files.length > 0) {
    //         const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
    //         setSelectedFiles({ files: files, urls: imageUrls });
    //         setIsModalClosed(false); // We are about to close the modal
    //     }
    //     setFormdata({ addModalOpen: false });
    // }

    const addNewCar = (files) => {
        if (files && files.length > 0) {
            // const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
            // setSelectedFiles({ files: files, urls: imageUrls });
            updateCarImage(files)
            // setIsModalClosed(false); // We are about to close the modal
        }

        //   CloseCarModal()
        setFormdata({ addModalOpen: false });
    }

    function onModalClose() {
        setFormdata({ addModalOpen: false });
        setIsModalClosed(true);
        // if (selectedFiles.files.length > 0) {
        //     setIsModalClosed(true); // Now the modal is closed, we can render the form
        // }
    }


    const { addModalOpen } = formdata
    return (
        <>
            <section >
                {selectedImages && selectedImages.length > 0 && (
                    <>
                        <h5 className='main-heading mb-2'>Selected Image Preview:</h5>
                        <div className='custom-scrollbar'>
                            <div class="card-block">

                                {selectedImages.map((image, index) => (
                                    <div key={index} className="mb-1">
                                        <div className="position-relative image-Preview">
                                            <span
                                                className="delete-bg"
                                                onClick={(e) => handleDeleteCar(e, index)}
                                            >
                                                <DeleteIcon />
                                            </span>
                                            {/* <img src={image} alt={`Selected car ${index + 1}`} style={{ maxWidth: '100%', height: 'auto'}} /> */}
                                            <img className='rounded-top-right' src={URL?.createObjectURL(image)} alt={`Selected car ${index + 1}`} style={{ width: '100%', height: 'auto' }} />

                                        </div>
                                        <select
                                            name='carImagePos'
                                            className="form-control"
                                            value={imageDetails[index]?.position || ''}
                                            onChange={(e) => handleImagePositionChange(e, index)}
                                        >
                                            <option value="">Select Position</option>
                                            {carPositions?.map(val => (
                                                <option key={val} value={val}>{val}</option>
                                            ))}
                                        </select>

                                    </div>
                                ))}
                                <div className="mob-100 mb-2">
                                    <div className="card add-card">
                                        <div className="add-content" onClick={() => setFormdata({ addModalOpen: true })}>
                                            <div className="add-icon"><img src='/images/add-icon.svg' alt="add icon" /></div>
                                            <p>Add New</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <CommonModel show={addModalOpen} size="modal-xl" onClose={onModalClose}>
                            <MultipalUploadPage
                                fileNote={'NOTE: Background size 1600 x 1200 pixels'}
                                //   fileIntructions={'(Wall height 600 pixels + floor height 600 pixels)'} 
                                fileIntructions=''

                                onFileSelect={addNewCar}
                                formdata={formdata}
                                setFormdata={setFormdata}
                                onClose={onModalClose}
                                acceptfile={['jpg', 'jpeg', 'png']}
                                width={'1600'}
                                height={'1200'}
                                fileSize={'400000000'}
                                isValidDimensions={true}
                                multiple={true}
                                cancelBtn={true}
                            />
                        </CommonModel>
                    </>
                )}
            </section>
        </>
    );
}

SelectedCarImage.propTypes = {
    selectedImages: PropTypes.arrayOf(PropTypes.string),
    imageDetails: PropTypes.array,
    // handleImagePositionChange: PropTypes.func,
}

SelectedCarImage.defaultProps = {
    selectedImages: [],
    imageDetails: [],
    // handleImagePositionChange: () => {},
}

function mapStateToProps({ login }) {
    return {
        isUserLogin: login?.isUserLogin,
        userDetails: login?.userDetails,
        loader: login?.loader
    }
}

export default connect(mapStateToProps)(SelectedCarImage)