import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { EMPTY_OBJECT } from '../../utils/helpers';

function CreateCarForm(props) {
    const { selectedImages, files } = props;

    return (
        <>
            <section class="card-block" aria-label="Preview Card">
                <h4>CreateCarForm page</h4>
                {selectedImages && selectedImages.length > 0 && (
                    <div>
                        <h5>Selected Image Preview:</h5>
                        {selectedImages.map((image, index) => (
                            <img key={index} src={image} alt={`Selected car ${index + 1}`} style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }} />
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}

CreateCarForm.propTypes = {
    selectedImages: PropTypes.arrayOf(PropTypes.string),
    files: PropTypes.array,
}

CreateCarForm.defaulProps = {
    selectedImages: [],
    files: [],
}

function mapStateToProps({ login }) {
    return {
        isUserLogin: login?.isUserLogin,
        userDetails: login?.userDetails,
        loader: login?.loader
    }
}

export default connect(mapStateToProps)(CreateCarForm)