import React, { useReducer } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { carPositions, EMPTY_OBJECT } from '../../utils/helpers';
import { DeleteIcon } from '../../components/common/model/svg';

function SelectedCarImage(props) {
    const { selectedImages, imageDetails, handleImagePositionChange } = props;

    
  const [formdata, setFormdata] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      carImage: props && props?.propData && props?.propData?.caruploadName ? props?.propData?.caruploadName : [],       
      loadData: false,
      uploadcar: true,
      logoUploadSizeError: false,
      logoImageExtError: false,
      modalCarDefault: false,
    }
  );

  console.log('coming selectedCar props',props)
console.log('coming selectedCar formdata',formdata)

    return (
        <>
            <section >
                {selectedImages && selectedImages.length > 0 && (
                    <>
                    <h5 className='main-heading mb-2'>Selected Image Preview:</h5>
                    <div class="card-block">
                     
                       
                        {selectedImages.map((image, index) => (
                            <div key={index} className="mb-4">
                                <div className="position-relative image-Preview">
                                   <span
                                        className="delete-bg"
                                        onClick={() =>
                                            OpenBannerDeleteModal(
                                                items._id,
                                                imageDetails?.length
                                            )
                                        }
                                    >
                                        <DeleteIcon />
                                    </span>
                                <img src={image} alt={`Selected car ${index + 1}`} style={{ maxWidth: '100%', height: 'auto'}} />
                             </div>
                                <select
                                    name='carImagePos'
                                    className="form-control mb-3"
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
                                        <div className="add-content" onClick={() => setLocalState({ addModalOpen: true })}>
                                            <div className="add-icon"><img src='add-icon.svg' alt="add icon" /></div>
                                            <p>Add New</p>
                                        </div>
                                    </div>
                                </div>
                    </div>
                    </>
                )}
            </section>
        </>
    );
}

SelectedCarImage.propTypes = {
    selectedImages: PropTypes.arrayOf(PropTypes.string),
    files: PropTypes.array,
    imageDetails: PropTypes.array,
    // handleImagePositionChange: PropTypes.func,
}

SelectedCarImage.defaultProps = {
    selectedImages: [],
    files: [],
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