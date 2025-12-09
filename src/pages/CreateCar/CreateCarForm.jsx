import React, { useReducer, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { EMPTY_OBJECT } from '../../utils/helpers';
import SelectedCarImage from './SelectedCarImage';
import StudioTabs from './StudioTabs';

function CreateCarForm(props) {
    const { selectedImages, files, dispatch } = props;

    const [formdata, setFormdata] = useReducer((state, newState) => ({ ...state, ...newState }),
        {
            carType: '',
            carBrand: '',
            carYear: '',
            carModel: '',
            carId: '',
            imageDetails: [],
        }
    );

    useEffect(() => {
        if (files.length > 0 && formdata.imageDetails.length === 0) {
            setFormdata({ imageDetails: files.map(() => ({ position: '' })) });
        }
    }, [files]);

    const saveCarDetails = () => {
        // TODO: Implement the logic to save the car details and uploaded files.
        console.log('Saving car with details:', { ...formdata, files });
    };

    const handleImagePositionChange = (e, index) => {
        const newImageDetails = [...formdata.imageDetails];
        newImageDetails[index] = { ...newImageDetails[index], position: e.target.value };
        setFormdata({ imageDetails: newImageDetails });
    };

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <h4 className="main-heading pb-md-3 mb-2">Create Car</h4>
                    <div className='grid_1_3 custom_tab_section'>
                        <StudioTabs
                            formdata={formdata}
                            setFormdata={setFormdata}
                            saveCarDetails={saveCarDetails}
                            dispatch={dispatch}
                        />
                        <SelectedCarImage
                            selectedImages={selectedImages}
                            imageDetails={formdata.imageDetails}
                            handleImagePositionChange={handleImagePositionChange}
                            files={files}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

CreateCarForm.propTypes = {
    selectedImages: PropTypes.arrayOf(PropTypes.string),
    files: PropTypes.array,
    dispatch: PropTypes.func,
}

CreateCarForm.defaulProps = {
    selectedImages: [],
    files: [],
    dispatch: PropTypes.func,
}

function mapStateToProps({ login }) {
    return {
        isUserLogin: login?.isUserLogin,
        userDetails: login?.userDetails,
        loader: login?.loader
    };
}

export default connect(mapStateToProps)(CreateCarForm);