import React, { useReducer, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { notify } from '../../utils/helpers';
import SelectedCarImage from './SelectedCarImage';
import StudioTabs from './StudioTabs';
import { createCarSave } from '../../Redux/Actions/carAction';
import { useNavigate } from 'react-router-dom';

const initialState = {
    carType: '',
    carBrand: '',
    carYear: '',
    carModel: '',
    carId: '',
    carColor: '',
    carImage: [],
    caruploadName: [],
    carImagesPosNames: [],
    dataImage: [],
    backgroundURL: '',
    activeLogoURL: '',
    activeBannerURL: '',
    loader: false,
    imageDetails: [],
};

function reducer(state, action) {
    return { ...state, ...action };
}

function CreateCarForm(props) {
    const { selectedImages, getCarImage = [], files = [], dispatch } = props;
    const navigate = useNavigate();
    const [formdata, setFormdata] = useReducer(reducer, initialState);

        useEffect(() => {
            if (files.length > 0 && formdata.imageDetails.length === 0) {
                setFormdata({ imageDetails: files.map(() => ({ position: '' })) });
            }
        }, [files]);

    /* =======================
       Sync images from redux
    ======================= */
    useEffect(() => {
        if (!getCarImage.length) return;

        const dataImage = getCarImage.map((img, index) => ({
            img:getCarImage[index],
            position: formdata.dataImage[index]?.position || '',
        }));

        setFormdata({ carImage: getCarImage,caruploadName: getCarImage, dataImage});
    }, [getCarImage]);

    /* =======================
       Image position change
    ======================= */
    const handleImagePositionChange = (e, index) => {
        const value = e.target.value;

        const newDataImage = [...formdata.dataImage];
        newDataImage[index] = {
            ...newDataImage[index],
            position: value,
            img: getCarImage[index],
        };

        const newPosNames = [...formdata.carImagesPosNames];
        value ? (newPosNames[index] = value) : newPosNames.splice(index, 1);

        setFormdata({
            dataImage: newDataImage,
            carImagesPosNames: newPosNames,
            // caruploadName: getCarImage,
            // carImage: getCarImage,
        });
    };

    /* =======================
       Save car
    ======================= */
    const saveCarDetails = () => {
        

        // if (formdata.carImagesPosNames.length !== formdata.caruploadName.length) {
        //     notify('error', 'Please select car position!');
        //     return;
        // }
        // const isPositionValid = formdata?.dataImage?.every(
        // item => typeof item.position === "string" && item.position.trim() !== ""
        // );
        if (!formdata?.dataImage?.every(item => item.position?.trim())) {
         notify('error', 'Please select car position!');
         return;
        }

        if (!getCarImage?.length) {
            notify('error', 'Please select car image!');
            return;
        }

        if (!formdata.carType || !formdata.carId || !formdata.carBrand) {
            notify('error', 'Please fill required (*)');
            return;
        }

        setFormdata({ loader: true });

        const formPostData = new FormData();

        formdata.dataImage.forEach(item => {
            formPostData.append('carImages', item.img);
        });

        formPostData.append('carType', formdata.carType);
        formPostData.append('carYear', formdata.carYear);
        formPostData.append('carColor', formdata.carColor);
        formPostData.append('carId', formdata.carId);
        formPostData.append('carBrand', formdata.carBrand);
        formPostData.append('carModel', formdata.carModel);
        formPostData.append('backgroundURL', formdata.backgroundURL);
        formPostData.append('numberPlateUrl', formdata.activeLogoURL);
        formPostData.append('bannerUrl', formdata.activeBannerURL);
        formPostData.append(
            'carImagesNames',
            JSON.stringify(formdata.carImagesPosNames)
        );

        dispatch(createCarSave(formPostData))
            .then(res => {
                // if (res?.statusCode === '1') {
                console.log('res',res)
                if (res) {
                    notify('success',res?.message || 'Car created successfully');
                     navigate('/dashboard');
                } else {
                    notify('error', res?.error?.responseMessage || 'Something went wrong');
                }
            })
            .catch(err => {
                notify('error', err?.message || 'Something went wrong');
            })
            .finally(() => {
                setFormdata({ loader: false });
            });
    };

    
  console.log('coming createform props',props)
console.log('coming createform formdata',formdata)

    return (
        <>
            <h4 className="main-heading mt-2 mb-2">Create Car</h4>

            <div className="grid_1_3 custom_tab_section">
                <StudioTabs
                    formdata={formdata}
                    setFormdata={setFormdata}
                    saveCarDetails={saveCarDetails}
                    dispatch={dispatch}
                />

                <SelectedCarImage
                    selectedImages={selectedImages}
                    imageDetails={formdata.dataImage}
                    handleImagePositionChange={handleImagePositionChange}
                    files={files}
                />
            </div>
        </>
    );
}

/* =======================
   PropTypes
======================= */
CreateCarForm.propTypes = {
    selectedImages: PropTypes.array,
    getCarImage: PropTypes.array,
    files: PropTypes.array,
    dispatch: PropTypes.func,
};

CreateCarForm.defaultProps = {
    selectedImages: [],
    getCarImage: [],
    files: [],
};

function mapStateToProps({ login }) {
    return {
        isUserLogin: login?.isUserLogin,
        userDetails: login?.userDetails,
        loader: login?.loader,
    };
}

export default connect(mapStateToProps)(CreateCarForm);
