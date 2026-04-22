import React, { useEffect, useReducer, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { displayDateFormat, EMPTY_ARRAY, EMPTY_OBJECT, notify } from '../../utils/helpers';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import { getAllCarImages, getCarDetails } from '../../Redux/Actions/carAction';
import { useParams } from 'react-router-dom';
import ImageGallery from "react-image-gallery";
// import stylesheet if you're not already using CSS @import
import "react-image-gallery/styles/css/image-gallery.css";
import { Tab, Tabs } from 'react-bootstrap';
import { GalleryView, GridView } from '../../components/common/model/svg';
import CarSideBar from './CarSideBar';

function CarDetails(props) {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState([]);
    // const { user } = useAuth();   
    const { dispatch, navigate, isUserLogin, loader, Link } = props
    const [formdata, setFormdata] = useReducer((state, newState) => ({ ...state, ...newState }),
        {
            carDetails: EMPTY_OBJECT,
            carID: '',
            galleImages: EMPTY_ARRAY,
            allImageURL: EMPTY_ARRAY,
            tabValue: 1,
            selectedImage: EMPTY_ARRAY,


        }
    );
    const { id } = useParams();
    useEffect(() => {
        if (formdata?.tabValue === 2) {
            setInputValue([]);
            setFormdata({ selectedImage: [] })
        } else {
            setInputValue(formdata?.selectedImage);
        }
    }, [formdata?.tabValue]);

    const clearAllCheck = () => {
        setInputValue([]);
        setFormdata({ selectedImage: [] })
    };

    useEffect(() => {
        getCarData(id)
        setFormdata({ selectedImage: [], carID: id })
    }, [id])

    const getCarData = (vehicleId) => {
        let vehicleIds = vehicleId ? vehicleId : formdata?.carID
        dispatch(getCarDetails(vehicleIds)).then((res) => {
            if (res?.statusCode == '1') {
                const data = res?.responseData || {};
                const carImageList = data?.carImages || [];

                const newresult = carImageList.map((item) => ({
                    ...item,
                    original: item.partUrl,
                    thumbnail: item.partUrl
                }));
                let allImagesURL = [];
                carImageList.forEach(item => allImagesURL.push(item.partUrl));

                setFormdata({ carDetails: data, galleImages: newresult, allImageURL: allImagesURL })

            } else {
                notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!')
            }
        }).catch((err) => {
            notify('error', err?.message ? err?.message : 'Something went wrong!')
        });

    };

    const changeTabValue = (e) => {
        if (e == 1) {
            setFormdata({ tabValue: 1 });
        } else {
            setFormdata({ tabValue: 2 });
        }
    };

    const changeCheckValue = (e, index, items) => {
        const { checked } = e.target

        setInputValue(prevValue => {
            if (checked) {
                return [...prevValue, index];
            } else {
                return prevValue.filter(value => value !== index);
            }
        });
        let selectImage = formdata.selectedImage
        if (checked) {
            selectImage.splice(index, 0, items)
        } else {
            const index = selectImage.indexOf(items);
            if (index > -1) { // only splice if item is found
                selectImage.splice(index, 1);
            }
            // selectImage.splice(index, 1)
        }
        setFormdata({ selectedImage: selectImage })

    };

    // const changeCheckValue = (e, index, items) => {
    //     const { checked } = e.target
    //     setInputValue(prevValue => {
    //         if (checked) {
    //             return [...prevValue, index];
    //         } else {
    //             return prevValue.filter(value => value !== index);
    //         }
    //     });
    //     let selectImage = [...formdata.selectedImage]
    //     if (checked) {
    //         selectImage.splice(index, 0, items)
    //     } else {
    //         selectImage.splice(index, 1)
    //     }
    //     setFormdata({ selectedImage: selectImage })

    // };

    const actionDownloadModal = () => {
        let items = formdata?.carDetails

        let payLoad = {
            imgArray: formdata?.selectedImage.length > 0 ? formdata?.selectedImage : formdata?.allImageURL,
            carBrand: items?.carBrand,
            carYear: items?.carYear,
            carModel: items?.carModel
        }


        dispatch(getAllCarImages(payLoad)).then((res) => {
            // ResponseFilter(res);
            if (res?.statusCode == '1') {
                const link = document.createElement('a');
                link.href = res?.responseData?.result;
                link.download = 'cars.zip';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link); // Clean up by removing the link
                notify('success', res.response?.data?.message ? res.response?.data?.message : 'Download Successful.')
                return true;
            } else {
                notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!')
            }
        }).catch((err) => {
            notify('error', err?.message ? err?.message : 'Something went wrong!')
        });

    }

    return (
        <>
            <div className='d-flex mt-4 details-car-page'>
                <section class="flex-1">
                    <Tabs
                        defaultActiveKey={1}
                        activeKey={formdata?.tabValue}
                        id="uncontrolled-tab-example"
                        onSelect={(e) => changeTabValue(e)}
                    >
                        <Tab eventKey={1} title={<GridView />}>
                            <div className='scroll-container'>
                                <div className="row">
                                    {formdata?.galleImages?.map((items, i) => {

                                        return (
                                            <div
                                                className="col-lg-3 col-md-4 col-sm-4 col-6 mob-100 mb-3"
                                                id="thing"
                                                key={i}

                                            >
                                                <div className={`h-100 car-details-box ${inputValue.includes(i) ? 'active' : ''}`}>
                                                    <label className="gallery-item-car-details">
                                                        <input type="checkbox"
                                                            onChange={(e) => changeCheckValue(e, i, items?.partUrl)}
                                                            checked={inputValue.includes(i)} />

                                                        <div className="gallery-img-overlay">
                                                            <img
                                                                src={formdata?.galleImages[i].partUrl}
                                                                alt=""
                                                                className="w-100"
                                                            />
                                                        </div>

                                                        <span className="custom-checkbox"></span>
                                                    </label>

                                                  
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </Tab>

                        <Tab eventKey={2} title={<GalleryView />}>
                            <ImageGallery items={formdata?.galleImages} />
                        </Tab>
                    </Tabs>

                </section>
                <CarSideBar inputValue={inputValue} carDetailsData={formdata} actionDownloadModal={actionDownloadModal} getCarData={getCarData} />
            </div>

        </>
    );
}

CarDetails.propTypes = {
    dispatch: PropTypes.func,
    data: PropTypes.object,
    loader: PropTypes.bool,
    userDetails: EMPTY_OBJECT,

}

CarDetails.defaulProps = {
    dispatch: PropTypes.func,
    data: EMPTY_OBJECT,
    userDetails: EMPTY_OBJECT,
    loader: PropTypes.bool,

}

function mapStateToProps({ login }) {
    return {
        isUserLogin: login?.isUserLogin,
        userDetails: login?.userDetails,
    }
}

export default connect(mapStateToProps)(CarDetails)