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
    const { selectedImages,setSelectedFiles , files = [], dispatch } = props;
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
        if (!selectedImages.length) return;

        const dataImage = selectedImages.map((img, index) => ({
            img: selectedImages[index],
            position: formdata.dataImage[index]?.position || '',
        }));

        setFormdata({ carImage: selectedImages, caruploadName: selectedImages, dataImage });
    }, [selectedImages]);

    /* =======================
       Image position change
    ======================= */
    const handleImagePositionChange = (e, index) => {
        const value = e.target.value;

        const newDataImage = [...formdata.dataImage];
        newDataImage[index] = {
            ...newDataImage[index],
            position: value,
            img: selectedImages[index],
        };

        const newPosNames = [...formdata.carImagesPosNames];
        value ? (newPosNames[index] = value) : newPosNames.splice(index, 1);

        setFormdata({
            dataImage: newDataImage,
            carImagesPosNames: newPosNames,
            // caruploadName: selectedImages,
            // carImage: selectedImages,
        });
    };

    /* =======================
      Car Image Add
    ======================= */
    const updateCarImage = (file) => {
        let carpos = selectedImages
        file.every((f)=> carpos?.push(f))
        setSelectedFiles({ files: carpos}); 
    };

    /* =======================
     Delete Car Image 
   ======================= */
    const handleDeleteCar = (e, index) => {
        let carpos = selectedImages
        let dataImageRes = formdata?.dataImage
        let carImagesPosNames=formdata?.carImagesPosNames
        carpos?.splice(index, 1);
        dataImageRes.splice(index, 1);
        carImagesPosNames.splice(index, 1);
        setSelectedFiles({ files: carpos});
        setFormdata({ ...formdata, dataImage: dataImageRes,carImagesPosNames:carImagesPosNames, });        
    }

    /* =======================
       Save car
    ======================= */
    const saveCarDetails = () => {

        const isValid = formdata?.dataImage.filter(item => item.position == '');
        if (formdata?.dataImage.length < 1 || formdata.dataImage.length !== selectedImages.length || isValid.length > 0) {
            notify('error', 'Please select car position!');
            return;
        }

        if (!selectedImages?.length) {
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

        const positions = formdata?.dataImage.map(item => item.position);

        formPostData.append('carType', formdata?.carType);
        formPostData.append('carYear', formdata?.carYear);
        formPostData.append('carColor', formdata?.carColor);
        formPostData.append('carId', formdata?.carId);
        formPostData.append('carBrand', formdata?.carBrand);
        formPostData.append('carModel', formdata?.carModel);
        formPostData.append('backgroundURL', formdata?.backgroundURL);
        formPostData.append('numberPlateUrl', formdata?.activeLogoURL);
        formPostData.append('bannerUrl', formdata?.activeBannerURL);
        // formPostData.append('carImagesNames',JSON.stringify(formdata.carImagesPosNames)
        formPostData.append('carImagesNames',JSON.stringify(positions)

        );

        dispatch(createCarSave(formPostData))
            .then(res => {
                // if (res?.statusCode === '1') {
                if (res) {
                    notify('success', res?.message || 'Car created successfully');
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



    return (
        <>
            {/* <h4 className="main-heading mt-2 mb-2">Create Car</h4> */}

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
                    handleDeleteCar={handleDeleteCar}
                    updateCarImage={updateCarImage}
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
    selectedImages: PropTypes.array,
    files: PropTypes.array,
    dispatch: PropTypes.func,
};

CreateCarForm.defaultProps = {
    selectedImages: [],
    selectedImages: [],
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
