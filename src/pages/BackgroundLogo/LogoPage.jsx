import React, { useEffect, useReducer } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {  EMPTY_ARRAY, EMPTY_OBJECT, notify } from '../../utils/helpers';
import { actionBackgroundDelete, updateCarBackground, uploadBackground } from '../../Redux/Actions/carAction';
import { useAuth } from '../../context/AuthContext';
import AddBackgroundPage from './AddBackgroundPage';
import CommonModel from '../../components/common/model/CommonModel';
import UploadPage from '../../components/common/UploadPage/UploadPage';

function LogoPage(props) {
    const { userDetails,dispatch} = props;
    const { getUserData } = useAuth();

    const [formdata, setFormdata] = useReducer((state, newState) => ({ ...state, ...newState }),
      { 
        logo:EMPTY_ARRAY,
        addModalOpen: false,
        deleteModalOpen: false,
        backgroundId: '',
        isSubmit: false,
      }
    );

    useEffect(()=>{
      if(userDetails?.logosUploaded){
         setFormdata({logo:userDetails?.logosUploaded}) 
      }else{
        setFormdata({logo:EMPTY_ARRAY})
      }
      },[userDetails])

  const changeLogo = (e) => {
    console.log('coming',e.target.value)
        const {value}=e.target
        let payload = {
            "backgroundId": value,
            "backgroundType": "logo"
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
      function BgUploadDone() {
        console.log('coming logo')
            var bg = new FormData();
            bg.append('bg', formdata.uploadedfile);
            let obj = `backgroundType=${'logo'}`;
            setFormdata({ isSubmit: true })      
            console.log('coming BgUploadDone 3',bg)
            dispatch(uploadBackground(bg,obj)).then((res) => {
                 console.log('coming BgUploadDone res',res)
                setFormdata({ isSubmit: false })
                if (res?.statusCode == '1') {                
                    changeBackground()
                    notify('success', res.response?.data?.message ? res.response?.data?.message : 'Data Updated successful.')
    
    
                } else {
                    notify('error', res?.error?.responseMessage ? res?.error?.responseMessage : 'Something went wrong!')
                }
            }).catch((err) => {
                setFormdata({ isSubmit: false })
                notify('error', err?.message ? err?.message : 'Something went wrong!')
            });
            setFormdata({addModalOpen :false})
            getUserData()
          
        }
         const handleDelete = (e) => {
                setFormdata({isSubmit: true})      
                 let payload = {
                    "backgroundId": formdata?.backgroundId,
                    "backgroundType": "logo"
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
    
    const { logo,addModalOpen ,deleteModalOpen } = formdata;

  return (
    <>  
   
      <div className='bg-logo-blk'>      
    
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
                    <button class="delete-btn"><img src='delete-icon.svg' alt="delete" disabled={formdata?.isSubmit} onClick={()=>{setFormdata({deleteModalOpen :true,backgroundId:item?._id})}} /></button>
                  </div>
                </div>)
            }) : null}
    
    
            <div class="card add-card">
              <div class="add-content" onClick={()=>{setFormdata({addModalOpen :true})}}>
                <div class="add-icon"><img src='add-icon.svg' /></div>
                <p>Add Logo</p>
              </div>
            </div>
          </div>

          <CommonModel show={deleteModalOpen} onClose={() => setFormdata({deleteModalOpen :false})}>
                    <img src="/delete-image.png" alt="Delete confirmation" />
                    <h2>Are you sure?</h2>
                    <p>This action cannot be undone. Your data will be permanently deleted.</p>
                    <div className="popup-btn">
                        <button type="button" className="btn btn-login" onClick={handleDelete}>Yes, Delete</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setFormdata({deleteModalOpen :false})}>Cancel</button>
                    </div>
                </CommonModel>

          <CommonModel show={addModalOpen} size="modal-xl" onClose={() => setFormdata({addModalOpen :false})}>
            <UploadPage 
              fileNote={'NOTE: Background size 1600 x 1201 pixels'}
              fileIntructions={'(Wall height 600 pixels + floor height 600 pixels)'} 
              UploadDone={BgUploadDone}
              formdata={formdata} 
              setFormdata={setFormdata}
              onClose={() => setFormdata({addModalOpen :false})}
              acceptfile={['jpg', 'jpeg', 'png']}
              width={'1600'}
              height={'1200'}
              fileSize={'400000000'}
              isValidDimensions={true}
              />                               
        </CommonModel>
</>
  );
}

LogoPage.propTypes = {
    dispatch: PropTypes.func,
    data: PropTypes.object,
    loader: PropTypes.bool,
    userDetails: EMPTY_OBJECT, 

}

LogoPage.defaulProps = {
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

export default connect(mapStateToProps)(LogoPage)