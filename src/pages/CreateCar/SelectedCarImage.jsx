import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { carPositions, EMPTY_OBJECT } from '../../utils/helpers';
import { DeleteIcon } from '../../components/common/model/svg';

function SelectedCarImage(props) {
    const { selectedImages, imageDetails, handleImagePositionChange } = props;

    return (
        <>
            <section class="card-block" aria-label="Preview Card">
                {selectedImages && selectedImages.length > 0 && (
                    <div>
                        <h5>Selected Image Preview:</h5>
                        {selectedImages.map((image, index) => (
                            <div key={index} className="mb-4">
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
                                <img src={image} alt={`Selected car ${index + 1}`} style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }} />
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
                                  <div className="mob-100 mb-2">
                                    <div className="card add-card">
                                        <div className="add-content" onClick={() => setLocalState({ addModalOpen: true })}>
                                            <div className="add-icon"><img src='add-icon.svg' alt="add icon" /></div>
                                            <p>Add Background</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}

SelectedCarImage.propTypes = {
    selectedImages: PropTypes.arrayOf(PropTypes.string),
    files: PropTypes.array,
    imageDetails: PropTypes.array,
    handleImagePositionChange: PropTypes.func,
}

SelectedCarImage.defaultProps = {
    selectedImages: [],
    files: [],
    imageDetails: [],
    handleImagePositionChange: () => {},
}

function mapStateToProps({ login }) {
    return {
        isUserLogin: login?.isUserLogin,
        userDetails: login?.userDetails,
        loader: login?.loader
    }
}

export default connect(mapStateToProps)(SelectedCarImage)