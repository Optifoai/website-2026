import React, { useReducer, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { EMPTY_OBJECT, notify } from '../../utils/helpers';
import SelectedCarImage from './SelectedCarImage';
import StudioTabs from './StudioTabs';
import { createCarSave } from '../../Redux/Actions/carAction';

function CreateCarForm(props) {
    const { selectedImages,getCarImage, files, dispatch } = props;

    const [formdata, setFormdata] = useReducer((state, newState) => ({ ...state, ...newState }),
        {
            carType: '',
            carBrand: '',
            carYear: '',
            carModel: '',
            carId: '',
            imageDetails: [],

            caruploadName:[],
            carImagesPosNames:[],
            carImage:[],
            uploadBanner: '',
            backgroundURL:'',
            numberPlateUrl:'',
            bannerUrl:'',
            dataImage:[],
        }
    );

    useEffect(() => {
        if (files.length > 0 && formdata.imageDetails.length === 0) {
            setFormdata({ imageDetails: files.map(() => ({ position: '' })) });
        }
    }, [files]);

    

    useEffect(() => { 
    console.log('useEffect 1',props.getCarImage)
    let dataImage= getCarImage?.map((item,index) => ({
        position:formdata?.dataImage?.[index] ? formdata?.dataImage[index]?.position :'',//for autofill postion if add new image
        img: item 
    }));

    console.log('useEffect 1 dataImage',dataImage)
    
    setFormdata({carImage: getCarImage,caruploadName:getCarImage ,dataImage:dataImage});
}, [getCarImage?.length>0]);

    const saveCarDetails = () => {
        // TODO: Implement the logic to save the car details and uploaded files.
        console.log('Saving car with details:', { ...formdata, files });
        // };

        // const saveCardetails=()=>{

        let validationForm = true
        if (formdata?.carImage?.length <= 0) {

            validationForm = false
            setFormdata({ ...formdata, loader: false });
            notify('error', 'Please select car image!');
            
        } else if (formdata?.carImagesPosNames?.length != formdata?.caruploadName?.length) {

            validationForm = false
            setFormdata({ ...formdata, loader: false});
            notify('error', 'Please select car position!');
            
        }
        else if ((!formdata?.carType && formdata?.carType == '') || (!formdata?.carId && formdata?.carId == '') || (!formdata?.carBrand && formdata?.carBrand == '')) {

            validationForm = false
            setFormdata({ ...formdata, loader: false});
            notify('error', 'Please fill required (*)');
            
        } else {

            validationForm = true
        }

        if (validationForm) {
           

            setFormdata({ ...formdata, loader: true });
            let imageFiles = formdata?.dataImage

            let formPostData = new FormData()
            for (let i = 0; i < imageFiles?.length; i++) {
                formPostData.append("carImages", imageFiles[i]?.img);
            }
            const carPositionData = imageFiles?.map((item, i) => (item.position)); //get position

            formPostData.append('carType', formdata?.carType ? formdata?.carType : '')
            formPostData.append('carYear', formdata?.carYear ? formdata?.carYear : '')
            formPostData.append('carColor', formdata?.carColor ? formdata?.carColor : '')
            formPostData.append('carId', formdata?.carId ? formdata?.carId : '')
            formPostData.append('carBrand', formdata?.carBrand ? formdata?.carBrand : '')
            formPostData.append('carModel', formdata?.carModel ? formdata?.carModel : '')
            // formPostData.append('backgroundURL', backgroundURL ? backgroundURL : '')
            // formPostData.append('numberPlateUrl', numberPlateUrl ? numberPlateUrl : '') 
            // formPostData.append('bannerUrl', bannerUrl ? bannerUrl : '')  
            formPostData.append('backgroundURL', formdata?.backgroundURL ? formdata?.backgroundURL : '')
            formPostData.append('numberPlateUrl', formdata?.activeLogoURL ? formdata?.activeLogoURL : '')
            formPostData.append('bannerUrl', formdata?.activeBannerURL ? formdata?.activeBannerURL : '')
            formPostData.append('carImagesNames', carPositionData?.length > 0 ? JSON.stringify(carPositionData) : '')
            // formPostData.append('carImagesNames', formdata?.carImagesPosNames ? JSON.stringify(formdata?.carImagesPosNames) : '')
            dispatch(createCarSave(formPostData)).then((res) => {
                if (res?.statusCode == '1') {
                    notify('success', res.response?.data?.message ? res.response?.data?.message : 'car created successfully.');
                    setFormdata({ loader: false });
                    // getCarData()
                } else {
                    notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!');
                    setFormdata({ loader: false });
                }
            }).catch((err) => {
                notify('error', err?.message ? err?.message : 'Something went wrong!');
                setFormdata({ loader: false });
            });


        }


    }

    const handleImagePositionChangeOld = (e, index) => {
        const newImageDetails = [...formdata.imageDetails];
        newImageDetails[index] = { ...newImageDetails[index], position: e.target.value };
        setFormdata({ imageDetails: newImageDetails });
    };

     const handleImagePositionChange = (e, index) => {
        const value=e.target.value
        const newImageDetails = [...formdata.dataImage];
        newImageDetails[index] = { ...newImageDetails[index], position: e.target.value };
        setFormdata({ dataImage: newImageDetails });
        let carImagesPosNames =formdata?.carImagesPosNames
        if(value && value!=''){
            carImagesPosNames.splice(index,1,value)
            
        }else{
            carImagesPosNames.splice(index,1)
        }
    };



 console.log('coming createcar props',props)
console.log('coming createcar formdata',formdata)

    return (
        <>
            <h4 className="main-heading mt-2 mb-2">Create Car</h4>
            <div className='grid_1_3 custom_tab_section'>
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

CreateCarForm.propTypes = {
    selectedImages: PropTypes.arrayOf(PropTypes.string),
    getCarImage: PropTypes.array,
    files: PropTypes.array,
    dispatch: PropTypes.func,
}

CreateCarForm.defaulProps = {
    selectedImages: [],
    getCarImage:[],
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