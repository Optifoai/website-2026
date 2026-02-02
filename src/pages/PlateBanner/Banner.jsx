import React, { useEffect, useReducer } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { EMPTY_ARRAY, EMPTY_OBJECT, notify } from '../../utils/helpers';
import { actionBackgroundDelete, updateCarBackground } from '../../Redux/Actions/carAction';
import { useAuth } from '../../context/AuthContext';
import LoaderSpiner from '../../hooks/LoaderSpiner';
import CommonModel from '../../components/common/model/CommonModel';
import AddBanner from './AddBanner';

function Banner(props) {
    const { userDetails, dispatch, loader } = props;
    const { user, getUserData } = useAuth();

    const [formdata, setFormdata] = useReducer((state, newState) => ({ ...state, ...newState }),
        {
            background: EMPTY_ARRAY,
            deleteModalOpen: false,
            backgroundId: '',
            isSubmit: false,
            addModalOpen: false,
        }
    );

    useEffect(() => {
        if (userDetails?.banners) {
            setFormdata({ background: userDetails?.banners })
        } else {
            setFormdata({ background: EMPTY_ARRAY })
        }
    }, [userDetails])

    const changeBackgroud = (e) => {
        const { value } = e.target
        let payload = {
            "backgroundId": value,
            "backgroundType": "banner"
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
    };

    const handleDelete = (e) => {
        setFormdata({isSubmit: true})      
         let payload = {
            "backgroundId": formdata?.backgroundId,
            "backgroundType": "banner"
        }
        dispatch(actionBackgroundDelete(payload)).then((res) => {
            setFormdata({isSubmit: false})
            if (res?.statusCode == '1') {
                getUserData()
                notify('success', res.response?.data?.message ? res.response?.data?.message : 'Data Deleted successful.')


            } else {
                notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!')
            }
        }).catch((err) => {
            setFormdata({isSubmit: false})
            notify('error', err?.message ? err?.message : 'Something went wrong!')
        });
        setFormdata({deleteModalOpen :false});

    };




    const { background,deleteModalOpen ,addModalOpen} = formdata;

    return (
        <>
            {/* {loader ? <LoaderSpiner /> : */}
                <div className='bg-logo-blk  flex-wrap'>
                    {background?.length > 0 ? background?.map((item, index) => {
                        return (<>
                            <div class={`card ${item?.isActive ? 'active' : ''}`} key={`bg-${index}`}>
                                <img src={item?.backgroundImage} alt={`Background ${index + 1}`} />
                                <div class="bottom-row">
                                    <label class="radio-item">
                                        <input type="radio" checked={item?.isActive} name="background" value={item?._id} onChange={changeBackgroud} />
                                        <span class="custom-radio"></span>
                                        {item?.isActive ? 'Active' : ''}
                                    </label>
                                    <button class="delete-btn"><img src='/images/delete-icon.svg' alt="delete" disabled={formdata?.isSubmit} onClick={()=>{setFormdata({deleteModalOpen :true,backgroundId:item?._id})}} /></button>
                                </div>
                            </div>

                        </>
                        )
                    })
                        : null}

                    <div class="card add-card">
                        <div class="add-content" onClick={()=>{setFormdata({addModalOpen :true})}}>
                            <div class="add-icon" ><img src='/images/add-icon.svg' /></div>
                            <p >Add New Banner</p>
                        </div>
                    </div>

                </div>
                {/* } */}

                
                            <CommonModel show={deleteModalOpen} onClose={() => setFormdata({deleteModalOpen :false})}>
                                <img src="/images/delete-image.png" alt="Delete confirmation" />
                                <h2>Delete Banner?</h2>
                                <p>Are you sure you want to delete this Banner from Optifo?</p>
                                <div className="popup-btn">
                                    <button type="button" className="btn btn-login" onClick={handleDelete}>Yes, Delete</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setFormdata({deleteModalOpen :false})}>Cancel</button>
                                </div>
                            </CommonModel>

                            
                            <CommonModel show={addModalOpen}   customeClass={'mw-100 w-100 p-4'} size="modal-xl" onClose={() => setFormdata({addModalOpen :false})}>
                                <AddBanner onClose={() => setFormdata({addModalOpen :false})}/>                               
                            </CommonModel>
        </>
    );
}

Banner.propTypes = {
    dispatch: PropTypes.func,
    data: PropTypes.object,
    loader: PropTypes.bool,
    userDetails: EMPTY_OBJECT,

}

Banner.defaulProps = {
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

export default connect(mapStateToProps)(Banner)