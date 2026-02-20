import React, { useEffect, useReducer } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import BackgroundPage from './BackgroundPage';
// import LogoPage from './logoPage';
import LoaderSpiner from '../../hooks/LoaderSpiner';
import LogoPage from './LogoPage';

function BackgroundLogoPage(props) {
const { dispatch, userDetails, navigate ,loader} = props;
const { user } = useAuth();
const { t, i18n } = useTranslation();
const [formdata, setFormdata] = useReducer((state, newState) => ({ ...state, ...newState }),
  { 
    logo:EMPTY_ARRAY,
    background:EMPTY_ARRAY,
  }
);

useEffect(()=>{
  setFormdata({background:userDetails?.backgroundsUploaded ? userDetails?.backgroundsUploaded : EMPTY_ARRAY})
  setFormdata({logo:userDetails?.logosUploaded ? userDetails?.logosUploaded : EMPTY_ARRAY})
},[userDetails])



  const { background, logo } = formdata;
  return (
    <>
    {loader ? <LoaderSpiner /> :<>
      <div class="bg-gradient">
        <h3 className='heading-title'>Background</h3>
        <p className='heading-subtitle'>Select the background type you want to apply on all your exterior images.</p>
      </div>
        <BackgroundPage background={background} />

      <div className='divider-1'></div>

      <div class="bg-gradient">
        <h3 className='heading-title'>Logo</h3>
        <p className='heading-subtitle'>Select the Logo you want to apply on all your exterior images.</p>
      </div>
      <LogoPage logo={logo} />
      </>}
    </>
  );
}

BackgroundLogoPage.propTypes = {
  dispatch: PropTypes.func,
  data: PropTypes.object,
  loader: PropTypes.bool,
  userDetails: EMPTY_OBJECT,

}

BackgroundLogoPage.defaulProps = {
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

export default connect(mapStateToProps)(BackgroundLogoPage)