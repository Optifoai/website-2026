import React, { useEffect, useReducer, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { EMPTY_ARRAY, EMPTY_OBJECT, notify } from '../../utils/helpers';
import { actionBackgroundDelete, updateCarBackground, uploadBackground } from '../../Redux/Actions/carAction';
import { useAuth } from '../../context/AuthContext';
import LoaderSpiner from '../../hooks/LoaderSpiner';
import { Tab, Tabs } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import {UplpadFileIcon} from '../../components/common/model/svg.jsx'
import UploadPage from '../../components/common/UploadPage/UploadPage';


function AddBackgroundPage(props) {
    const { userDetails, dispatch, loader,onClose } = props;
    const { user, getUserData } = useAuth();
    const { t, i18n } = useTranslation();
    // const [uploadedBackground, setUploadedBackground] = useState('');
    const [formdata, setFormdata] = useReducer((state, newState) => ({ ...state, ...newState }),
        {
            tabValue: 1,
            optifoBackgrounds: EMPTY_ARRAY,
            background: EMPTY_ARRAY,
            deleteModalOpen: false,
            backgroundId: '',
            isSubmit: false,
            addModalOpen: false,
            BgImageUrl: {}, 

        }
    );

    useEffect(() => {
        if (userDetails?.backgroundsUploaded) {
            setFormdata({ optifoBackgrounds: userDetails?.optifoBackgrounds })
        } else {
            setFormdata({ background: EMPTY_ARRAY })
        }
    }, [userDetails])


    const changeTabValue = (e) => {
        if (e == 1) {
            setFormdata({ tabValue: 1 });
        } else {
            setFormdata({ tabValue: 2 });
        }
    };

    const handleBackgroud= ()=>{
        setFormdata({ isSubmit: true })
        let payload = {
            "url": formdata?.BgImageUrl?.backgroundImage,
            "backgroundType": "background"
        }
       
        dispatch(uploadBackground(payload)).then((res) => {
            setFormdata({ isSubmit: false })
            if (res?.statusCode == '1') {
                getUserData()
                changeBackground(res.responseData)
                notify('success', res.response?.data?.message ? res.response?.data?.message : 'Data Updated successful.')


            } else {
                notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!')
            }
        }).catch((err) => {
            setFormdata({ isSubmit: false })
            notify('error', err?.message ? err?.message : 'Something went wrong!')
        });
        onClose()
        setFormdata({ addModalOpen: false });
    }

    const changeBackground = (data='') => {
       let payload =
       {
         backgroundId:data? data:  formdata?.BgImageUrl,
         backgroundType: "background"
        }
            dispatch(updateCarBackground(payload)).then(res => {
                if (res?.statusCode == '1') {
                    getUserData()
                    notify('success', res?.responseData?.message ? res?.responseData?.message : 'Data updated successfully!');
                } else {
                    notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Failed');
                }
            }).catch(err => {
                notify('error', err?.message ? err?.message : 'An error occurred.');
            });
            // getUserData()
        };
    
//    upload code
 
    function BgUploadDone() {
        var bg = new FormData();
        bg.append('bg', formdata.uploadedfile);
        let obj = `backgroundType=${'background'}`;
        setFormdata({ isSubmit: true })
        dispatch(uploadBackground(bg,obj)).then((res) => {
            setFormdata({ isSubmit: false })
            if (res?.statusCode == '1') { 
                setFormdata({BgImageUrl:res?.responseData})               
                changeBackground(res?.responseData)
                notify('success', res.response?.data?.message ? res.response?.data?.message : 'Data Updated successful.')


            } else {
                notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!')
            }
        }).catch((err) => {
            setFormdata({ isSubmit: false })
            notify('error', err?.message ? err?.message : 'Something went wrong!')
        });
        onClose()
    }



    const { optifoBackgrounds, deleteModalOpen, addModalOpen } = formdata;

    return (
        <>
         <h2>Add a New Custom Background</h2>
            <Tabs
                defaultActiveKey={1}
                activeKey={formdata?.tabValue}
                id="uncontrolled-tab-example"
                onSelect={(e) => changeTabValue(e)}
                className='background-tabs justify-content-center'
            >   
                <Tab eventKey={1} title='Gallery'>
                    
                      <div className="bg-modal-list">
                        <div className="gallery-row">
                            {optifoBackgrounds.map((item, i) => {
                                return (
                                    <div className="" key={i}>
                                        <label class="">
                                            <input
                                                type="radio"
                                                name="showBgValue"
                                                value={formdata?.BgImageUrl?.backgroundImage}
                                                onChange={() => setFormdata({ BgImageUrl: item })}
                                            />
                                            <span class="checkmark">
                                                <img src='check-icon.png'/>
                                            </span>
                                            <div className="custom-bg-in">
                                                <img src={item.backgroundImage} className="w-100 rounded-8" />
                                            </div>
                                        </label>

                                            
                                       
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="popup-btn" style={{ maxWidth:'250px',  marginLeft: 'auto', marginRight: 'auto'}}>
                        <button type="button" className="btn btn-login" onClick={handleBackgroud}>Ok</button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    </div>
                </Tab>
                <Tab eventKey={2} title='Upload'>
                    <UploadPage 
                    fileNote={'NOTE: Background size 1600 x 1200 pixels'}
                    fileIntructions={'(Wall height 600 pixels + floor height 600 pixels)'} 
                    UploadDone={BgUploadDone}
                    formdata={formdata} 
                    setFormdata={setFormdata}
                    onClose={onClose}
                    acceptfile={['jpg', 'jpeg', 'png']}
                    width={'1600'}
                    height={'1200'}
                    fileSize={'400000000'}
                    isValidDimensions={true}
                  
                    />
                 
                </Tab>

            </Tabs>
        </>
    );
}

AddBackgroundPage.propTypes = {
    dispatch: PropTypes.func,
    data: PropTypes.object,
    loader: PropTypes.bool,
    userDetails: EMPTY_OBJECT,

}

AddBackgroundPage.defaulProps = {
    dispatch: PropTypes.func,
    data: EMPTY_OBJECT,
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

export default connect(mapStateToProps)(AddBackgroundPage)