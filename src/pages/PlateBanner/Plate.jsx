import React, { useEffect, useReducer } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {  EMPTY_ARRAY, EMPTY_OBJECT, notify } from '../../utils/helpers';
import { actionBackgroundDelete, updateCarBackground, uploadBackground } from '../../Redux/Actions/carAction';
import { useAuth } from '../../context/AuthContext';
import CommonModel from '../../components/common/model/CommonModel';
import UploadPage from '../../components/common/UploadPage/UploadPage';
import LoaderSpiner from '../../hooks/LoaderSpiner';

function Plate(props) {
    const { userDetails,dispatch,loader} = props;
    const { getUserData } = useAuth();

    const [formdata, setFormdata] = useReducer((state, newState) => ({ ...state, ...newState }),
      { 
        logo:EMPTY_ARRAY,
        addLogoModalOpen: false,
        deleteModalOpen: false,
        backgroundId: '',
        isSubmit: false,
      }
    );

    useEffect(()=>{
      if(userDetails?.number_plates){
         setFormdata({logo:userDetails?.number_plates}) 
      }else{
        setFormdata({logo:EMPTY_ARRAY})
      }
      },[userDetails])

  const changeLogo = (e) => {
        const {value}=e.target
        let payload = {
            "backgroundId": value,
            "backgroundType": "number_plate"
        } 
        dispatch(updateCarBackground(payload)).then(res => {
            if (res?.statusCode == '1') {
                getUserData()
                notify('success', res?.responseData?.message ? res?.responseData?.message :'Data updated successfully!');
            } else {
                notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Failed');
            }
        }).catch(err => {
            notify('error', err?.message ?err?.message  : 'An error occurred.');
        });
    };

     const changeBackground = (data='') => {
           let payload =
           {
             backgroundId:data? data:  formdata?.BgImageUrl,
             backgroundType: "number_plate"
            }
                dispatch(updateCarBackground(payload)).then(res => {
                    setFormdata({addLogoModalOpen :false})
                    if (res?.statusCode == '1') {
                        getUserData()
                        notify('success', res?.responseData?.message ? res?.responseData?.message : 'Data updated successfully!');
                    } else {
                        notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Failed');
                    }
                }).catch(err => {
                    setFormdata({addLogoModalOpen :false})
                    notify('error', err?.message ? err?.message : 'An error occurred.');
                });
                // getUserData()
            };
      function BgUploadDone() {
        setFormdata({addLogoModalOpen :false})
            var bg = new FormData();
            bg.append('bg', formdata.uploadedfile);
            let obj = `backgroundType=${'number_plate'}`;
            setFormdata({ isSubmit: true })  
            dispatch(uploadBackground(bg,obj)).then((res) => {
                setFormdata({ isSubmit: false })
                if (res?.statusCode == '1') { 
                     getUserData()               
                    // changeBackground(res?.responseData)
                    notify('success', res.response?.data?.message ? res.response?.data?.message : 'Data Updated successful.')
    
    
                } else {
                    notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!')
                }
            }).catch((err) => {
                setFormdata({ isSubmit: false })
                setFormdata({addLogoModalOpen :false})
                notify('error', err?.message ? err?.message : 'Something went wrong!')
            });
          
        }
         const handleDelete = (e) => {
                setFormdata({isSubmit: true})      
                 let payload = {
                    "backgroundId": formdata?.backgroundId,
                    "backgroundType": "number_plate"
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

       
    
    const { logo,addLogoModalOpen ,deleteModalOpen } = formdata;

  return (
    <>  
   
        {loader ? <LoaderSpiner /> :<div className='bg-logo-blk logo-size'>      
    
            {logo?.length > 0 ? logo.map((item, index) => {
              return (
                <div class={`card ${item?.isActive ? 'active' : ''}`} key={`logo-${index}`}>
                  <img src={item?.backgroundImage} alt={`Logo ${index + 1}`} />
                  <div class="bottom-row">
                    <label class="radio-item">
                      <input type="radio" checked = {item?.isActive} name="logo" value={item?._id} onChange={changeLogo}/>
                      <span class="custom-radio"></span>
                        {item?.isActive ? 'Active' : ''}
                    </label>
                    <button class="delete-btn"><img src='/images/delete-icon.svg' alt="delete" disabled={formdata?.isSubmit} onClick={()=>{setFormdata({deleteModalOpen :true,backgroundId:item?._id})}} /></button>
                  </div>
                </div>)
            }) : null}
    
    
            <div class="card add-card">
              <div class="add-content" onClick={()=>{setFormdata({addLogoModalOpen :true})}}>
                <div class="add-icon"><img src='/images/add-icon.svg' /></div>
                <p>Add New Licence Plate</p>
              </div>
            </div>
          </div>}

          <CommonModel show={deleteModalOpen} onClose={() => setFormdata({deleteModalOpen :false})}>
                    <img src="/images/delete-image.png" alt="Delete confirmation" />
                    <h2>Delete Linece Plate?</h2>
                    <p>Are you sure you want to delete this Linece Plate from Optifo?</p>
                    <div className="popup-btn">
                        <button type="button" className="btn btn-login" onClick={handleDelete}>Yes, Delete</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setFormdata({deleteModalOpen :false})}>Cancel</button>
                    </div>
                </CommonModel>

          <CommonModel show={addLogoModalOpen} size="modal-xl" onClose={() => setFormdata({addLogoModalOpen :false})}>
            <h2>Add a New Plate</h2>
            <UploadPage 
              fileNote={'NOTE: Recommended height 140 pixels'}
            //   fileIntructions={'(Wall height 600 pixels + floor height 600 pixels file)'} 
             fileIntructions=''
              UploadDone={BgUploadDone}
              formdata={formdata} 
              setFormdata={setFormdata}
              onClose={() => setFormdata({addLogoModalOpen :false})}
              acceptfile={['jpg', 'jpeg', 'png']}
              width={true}
              height={'140'}
              fileSize={'400000000'}
              isValidDimensions={true}
              />                               
        </CommonModel>
</>
  );
}

Plate.propTypes = {
    dispatch: PropTypes.func,
    data: PropTypes.object,
    loader: PropTypes.bool,
    userDetails: EMPTY_OBJECT, 

}

Plate.defaulProps = {
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

export default connect(mapStateToProps)(Plate)