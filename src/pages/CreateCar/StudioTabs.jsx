import React, { useEffect, useReducer, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { SiReasonstudios } from 'react-icons/si';
import { LuRectangleEllipsis } from 'react-icons/lu';
import { RiQrScan2Line } from 'react-icons/ri';
import { MdLibraryBooks } from 'react-icons/md';
import { EMPTY_ARRAY, EMPTY_OBJECT, notify, carTypes } from '../../utils/helpers';
import { CheckIcon, DeleteIcon } from '../../components/common/model/svg';
import { actionBackgroundDelete, getBrandList, getCarBrandList, updateCarBackground, uploadBackground } from '../../Redux/Actions/carAction';
import { useAuth } from '../../context/AuthContext';
import CommonModel from '../../components/common/model/CommonModel';
// import AddBackgroundPage from '../BackgroundLogo/AddBackgroundPage';
import UploadPage from '../../components/common/UploadPage/UploadPage';

function StudioTabs(props) {
    const { formdata, setFormdata, saveCarDetails, userDetails, dispatch } = props;
    const { t } = useTranslation();
    const { getUserData } = useAuth();
    const [activeTab, setActiveTab] = useState('2');

    const [localState, setLocalState] = useReducer((state, newState) => ({ ...state, ...newState }),
        {
            deleteModalOpen: false,
            addModalOpen: false,
            backgroundId: '',
            isSubmit: false,
            uploadedfileType: '',
            deltedfileType: '',
            uploadedfile: '',
        }
    );






    // Mock data - replace with actual data from props or state management
    const displayBg = userDetails?.backgroundsUploaded || [];
    const displayPlate = userDetails?.number_plates || [];
    const displayBanner = userDetails?.banners || []; // Assuming banners are managed similarly
    // const carTypes = ['Sedan', 'SUV', 'Hatchback', 'Truck'];

    useEffect(() => {
        getBrandData();
    }, EMPTY_ARRAY);

    const getBrandData = () => {
        setFormdata({ loader: true })
        dispatch(getCarBrandList()).then((res) => {

            if (res?.statusCode == '1') {
                let data = res?.responseData?.carsList
                setFormdata({ ...formdata, carsList: data, loader: false })
            } else {
                setFormdata({ loader: false })
                notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!')
            }
        }).catch((err) => {
            setFormdata({ loader: false })
            notify('error', err?.message ? err?.message : 'Something went wrong!')
        });

    };

    const ActiveBg = (e, backgroundId) => {
        const { value } = e.target
        setFormdata({ ...formdata, activeBGId: backgroundId, backgroundURL: value, });
    };

    const ActiveLogo = (e, backgroundId) => {
        const { value } = e.target
        if (formdata?.activeLogoId === backgroundId) {
            setFormdata({ ...formdata, activeLogoId: '', activeLogoURL: '', });
        } else {
            setFormdata({ ...formdata, activeLogoId: backgroundId, activeLogoURL: value });
        }

    };

    const ActiveBanner = (e, backgroundId) => {
        if (formdata?.activeBannerId === backgroundId) {
            setFormdata({ ...formdata, activeBannerId: '', activeBannerURL: '', });
        } else {
            setFormdata({ ...formdata, activeBannerId: backgroundId, activeBannerURL: e.target.value, });
        }
    };


    // const handleBackgroundChange = (e) => {
    //     const { value } = e.target;
    //     let payload = {
    //         "backgroundId": value,
    //         "backgroundType": "background"
    //     };
    //     dispatch(updateCarBackground(payload)).then(res => {
    //         if (res?.statusCode == '1') {
    //             getUserData();
    //             notify('success', res?.responseData?.message ? res?.responseData?.message : 'Data updated successfully!');
    //         } else {
    //             notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Failed');
    //         }
    //     }).catch(err => {
    //         notify('error', err?.message ? err?.message : 'An error occurred.');
    //     });
    // };

    const handleDelete = () => {
        setLocalState({ isSubmit: true });
        let payload = {
            "backgroundId": localState?.backgroundId,
            "backgroundType": localState?.deltedfileType,
        };
        dispatch(actionBackgroundDelete(payload)).then((res) => {
            setLocalState({ isSubmit: false });
            if (res?.statusCode == '1') {
                getUserData();
                notify('success', res.response?.data?.message ? res.response?.data?.message : 'Data Deleted successful.');
            } else {
                notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!');
            }
        }).catch((err) => {
            setLocalState({ isSubmit: false });
            notify('error', err?.message ? err?.message : 'Something went wrong!');
        });
        setLocalState({ deleteModalOpen: false });
    };

    const openDeleteModal = (id, type) => {
        setLocalState({ deleteModalOpen: true, backgroundId: id, deltedfileType: type });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormdata({ [name]: value });
    };

    function BgUploadDone() {
        var bg = new FormData();

        bg.append('bg', localState.uploadedfile);
        let obj = `backgroundType=${localState.uploadedfileType}`;
        setLocalState({ isSubmit: true })
        dispatch(uploadBackground(bg, obj)).then((res) => {
            setLocalState({ uploadImageUrl: '', uploadedfile: '' })
            setLocalState({ isSubmit: false })
            if (res?.statusCode == '1') {
                setLocalState({ BgImageUrl: res?.responseData })
                getUserData();
                // changeBackground(res?.responseData)
                notify('success', res.response?.data?.message ? res.response?.data?.message : 'Data Updated successful.')


            } else {
                notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!')
            }
        }).catch((err) => {
            setLocalState({ isSubmit: false })
            notify('error', err?.message ? err?.message : 'Something went wrong!')
        });
        setLocalState({ addModalOpen: false })
        // onClose()
    }


    const { deleteModalOpen, addModalOpen, backgroundId, isSubmit } = localState;

    return (
        <>
            <Tabs
                defaultActiveKey="2"
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="border-0 flex-column"
            >
                <Tab eventKey="2" title={<><SiReasonstudios className="me-2" /> Studio</>}>
                    <div className="account-tab">

                        <div className="bg-logo-blk flex-wrap custom-scrollbar">
                            {displayBg?.map((item, i) => (
                                <div className="card" key={i}>
                                    <div className={`account-card-list ${item?.isActive ? 'active' : ''}`}>
                                        <span className="delete-bg" onClick={() => openDeleteModal(item._id, 'background')}>
                                            <DeleteIcon />
                                        </span>
                                        <div className='status-active'>
                                            <input
                                                type="radio"
                                                onChange={(e) => ActiveBg(e, item._id)}
                                                checked={item._id == formdata?.activeBGId}
                                                name="activeValue"
                                                value={item.backgroundImage}
                                            />
                                            <div className="select-bg">
                                                <div>
                                                    <CheckIcon />
                                                    <div className="bg-lable text-uppercase">
                                                        {t('active_text')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {item.backgroundImage && (
                                            <div className="card">
                                                <img src={item.backgroundImage} className="mxw-100" alt={`Background ${i + 1}`} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {displayBg.length < 10 && (
                                <div className="mob-100 mb-2">
                                    <div className="card add-card">
                                        <div className="add-content" onClick={() => setLocalState({ addModalOpen: true, uploadedfileType: 'background' })}>
                                            <div className="add-icon"><img src='/images/add-icon.svg' alt="add icon" /></div>
                                            <p>Add Background </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="">
                            <button onClick={() => setActiveTab('3')} type="button" className="buy-btn position-static">Proceed</button>
                        </div>

                    </div>
                </Tab>

                <Tab eventKey="3" title={<><LuRectangleEllipsis className="me-2" /> Plate</>}>
                    <div className="account-tab">
                        <div className="custom-scrollbar">
                            <div className="plate-list bg-logo-blk flex-wrap">
                                {displayPlate?.map((items, i) => {
                                    return (
                                        <div className="card" key={i}>
                                            <div className="account-card-list">
                                                <span
                                                    className="delete-bg"
                                                    onClick={() => openDeleteModal(items._id, 'number_plate')}
                                                >
                                                    <DeleteIcon />
                                                </span>
                                                <div className='status-active'
                                                // onClick={(e) => ActiveLogo(e, items._id)}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        // onChange={() => {
                                                        //     console.log();
                                                        // }}
                                                        onChange={(e) => ActiveLogo(e, items._id)}
                                                        // checked={items.isActive}
                                                        checked={items._id == formdata?.activeLogoId}
                                                        name="activeValueLogo"
                                                        value={items.backgroundImage}
                                                    // value={activeLogo.activeValueLogo}
                                                    />

                                                    <div className="select-bg">
                                                        <div>
                                                            <CheckIcon />
                                                            <div
                                                                className="bg-lable text-uppercase">
                                                                {t('active_text')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {items.backgroundImage ? (
                                                    <div
                                                        className="card">
                                                        <img
                                                            src={items.backgroundImage}
                                                            className="plate-mxw-100"
                                                        />
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {displayPlate.length < 10 && (
                                    <div className="mob-100 mb-2">
                                        <div className="card add-card">
                                            <div className="add-content" onClick={() => setLocalState({ addModalOpen: true, uploadedfileType: 'number_plate' })}>
                                                <div className="add-icon"><img src='/images/add-icon.svg' alt="add icon" /></div>
                                                <p>Add Plate</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Add plate management UI here */}

                            </div>
                        </div>
                        <div className="">
                            <button onClick={() => setActiveTab('4')} type="button" className=" buy-btn position-static">Proceed</button>
                        </div>
                    </div>
                </Tab>

                <Tab eventKey="4" title={<><RiQrScan2Line className="me-2" /> Banner</>}>
                    <div className="account-tab">
                        <div className="custom-scrollbar">
                            {/* <p>Banner selection UI will go here.</p> */}
                            <div className="bg-logo-blk flex-wrap custom-row">
                                {displayBanner?.map((items, i) => {
                                    return (
                                        <div className="card" key={i}>
                                            <div className="account-card-list">
                                                <span
                                                    className="delete-bg"
                                                    onClick={() => openDeleteModal(items._id, 'banner')}
                                                >
                                                    <DeleteIcon />

                                                </span>

                                                <div className='status-active'
                                                // onClick={(e) => ActiveBanner(e, items._id)}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        // onChange={() => {
                                                        //     console.log();
                                                        // }}
                                                        onChange={(e) => ActiveBanner(e, items._id)}
                                                        // checked={items.isActive}
                                                        checked={items._id == formdata?.activeBannerId}
                                                        name="activeValueBanner"
                                                        value={items.backgroundImage}
                                                    // value={activeBanner.activeValueBanner}
                                                    />


                                                    <div className="select-bg">
                                                        <div>
                                                            <p className='label-bg text-white'>{items?.label}</p>
                                                            <CheckIcon />
                                                            <div
                                                                className="bg-lable text-uppercase">
                                                                {t('active_text')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {items.backgroundImage ? (
                                                    <div
                                                        className="card">
                                                        <img
                                                            src={items.backgroundImage}
                                                            className="mxw-100"
                                                        />
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {displayBanner?.length < 10 ? (
                                    <div className="mob-100 mb-2">
                                        <div className="card add-card">
                                            <div className="add-content" onClick={() => setLocalState({ addModalOpen: true, uploadedfileType: 'banner' })}>
                                                <div className="add-icon"><img src='/images/add-icon.svg' alt="add icon" /></div>
                                                <p>Add Banner</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    ''
                                )}


                            </div>
                           
                        </div>
                         <div className="">
                                <button onClick={() => setActiveTab('5')} type="button" className="buy-btn position-static">Proceed</button>
                            </div>
                    </div>
                </Tab>

                <Tab eventKey="5" title={<><MdLibraryBooks className="me-2" /> Car Details</>}>
                    <div className="account-tab">
                        <div className=" car-details-blk">
                            <div className="row">
                                <div className="col-md-12">
                                    <label class="form-label">Car Type <span className='text-danger'> *</span></label>
                                    <select
                                        className="form-control mb-3"
                                        value={formdata.carType}
                                        name='carType'
                                        onChange={handleInputChange}
                                    >
                                        <option value={''}>Select</option>
                                        {carTypes?.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-12">
                                    <label class="form-label">Car Brand <span className='text-danger'> *</span></label>

                                    <select
                                        className="form-control mb-3"
                                        value={formdata.carBrand}
                                        name='carBrand'
                                        onChange={handleInputChange}
                                    >
                                        <option value={''}>Select</option>
                                        {formdata?.carsList?.map(type => (
                                            <option key={type?.brandName} value={type?.brandName}>{type?.brandName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12">
                                    <label class="form-label">Car Year </label>
                                    <input
                                        type='text'
                                        name='carYear'
                                        className="form-control mb-3"
                                        value={formdata.carYear}
                                        onChange={handleInputChange}
                                        placeholder='Car Year'
                                    />
                                </div>

                                <div className="col-md-12">
                                    <label class="form-label">Car Model</label>
                                    <input
                                        type='text'
                                        name='carModel'
                                        className="form-control mb-3"
                                        value={formdata.carModel}
                                        onChange={handleInputChange}
                                        placeholder='Car Model'
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12">
                                    <label class="form-label">Car Id <span className='text-danger'> *</span></label>
                                    <input
                                        type='text'
                                        name='carId'
                                        className="form-control mb-3"
                                        value={formdata.carId}
                                        onChange={handleInputChange}
                                        placeholder='Car Id'
                                    />
                                </div>
                            </div>

                            <div className="">
                                <button type="button" className="buy-btn position-static" onClick={saveCarDetails}>Save</button>
                            </div>
                        </div>
                    </div>
                </Tab>





            </Tabs>
            <CommonModel show={deleteModalOpen} onClose={() => setLocalState({ deleteModalOpen: false })}>
                <img src="/images/delete-image.png" alt="Delete confirmation" />
                <h2>Delete {localState?.deltedfileType?.replace(/_/g, " ")?.replace(/\b\w/g, char => char.toUpperCase())}?</h2>
                <p>Are you sure you want to delete this {localState?.deltedfileType?.replace(/_/g, " ")?.replace(/\b\w/g, char => char.toUpperCase())} from Optifo?</p>
                <div className="popup-btn">
                    <button type="button" className="btn btn-login" onClick={handleDelete} disabled={isSubmit}>Yes, Delete</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setLocalState({ deleteModalOpen: false })}>Cancel</button>
                </div>
            </CommonModel>

            <CommonModel show={addModalOpen} size="modal-xl" onClose={() => setLocalState({ addModalOpen: false })}>

                <UploadPage
                    fileNote={'NOTE: Background size 1600 x 1200 pixels'}
                    // fileIntructions={'(Wall height 600 pixels + floor height 600 pixels)'} 
                    fileIntructions=''

                    UploadDone={BgUploadDone}
                    formdata={localState}
                    setFormdata={setLocalState}
                    onClose={() => setLocalState({ addModalOpen: false })}
                    acceptfile={['jpg', 'jpeg', 'png']}
                    width={'1600'}
                    height={'1200'}
                    fileSize={'400000000'}
                    isValidDimensions={false}
                />
            </CommonModel></>
    );
}

StudioTabs.propTypes = {
    formdata: PropTypes.object.isRequired,
    setFormdata: PropTypes.func.isRequired,
    saveCarDetails: PropTypes.func.isRequired,
    userDetails: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
};

StudioTabs.defaultProps = {
    userDetails: EMPTY_OBJECT,
    dispatch: () => { },
};

function mapStateToProps({ login }) {
    return {
        isUserLogin: login?.isUserLogin,
        userDetails: login?.userDetails,
        loader: login?.loader
    }
}

export default connect(mapStateToProps)(StudioTabs);