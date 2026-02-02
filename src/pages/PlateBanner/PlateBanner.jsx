import React, { useEffect, useReducer } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import Banner from './Banner';
import LoaderSpiner from '../../hooks/LoaderSpiner';
import Plate from './Plate';

function PlateBanner(props) {
const { dispatch, userDetails, navigate ,loader} = props;
const { user } = useAuth();
const { t, i18n } = useTranslation();
const [formdata, setFormdata] = useReducer((state, newState) => ({ ...state, ...newState }),
  { 
    number_plates:EMPTY_ARRAY,
    banner:EMPTY_ARRAY,
  }
);

useEffect(()=>{
  setFormdata({banner:userDetails?.banners ? userDetails?.banners : EMPTY_ARRAY})
  setFormdata({number_plates:userDetails?.number_plates ? userDetails?.number_plates : EMPTY_ARRAY})
},[userDetails])



  const { banner, number_plates } = formdata;
  return (
    <>
    {loader ? <LoaderSpiner /> :<>
      <div class="bg-gradient">
        <h3 className='heading-title'>Licence Plate</h3>
        <p className='heading-subtitle'>Select the Licence Plate you want to apply on all your exterior images.</p>
      </div>
       <Plate logo ={number_plates} />
       

      <div className='divider-1'></div>
 <div class="bg-gradient">
        <h3 className='heading-title'>Banner</h3>
        <p className='heading-subtitle'>Select the Banner type you want to apply on all your exterior images.</p>
      </div>
     
      <Banner background ={banner} />
      </>}
    </>
  );
}

PlateBanner.propTypes = {
  dispatch: PropTypes.func,
  data: PropTypes.object,
  loader: PropTypes.bool,
  userDetails: EMPTY_OBJECT,

}

PlateBanner.defaulProps = {
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

export default connect(mapStateToProps)(PlateBanner)