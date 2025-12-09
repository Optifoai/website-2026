import React, { useReducer } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { EMPTY_ARRAY, EMPTY_OBJECT } from '../../utils/helpers';

import { uploadBackground } from '../../Redux/Actions/carAction';
import { useAuth } from '../../context/AuthContext';
import LoaderSpiner from '../../hooks/LoaderSpiner';
import { useTranslation } from 'react-i18next';

function Brand(props) {
   const { t } = useTranslation();
      const { user,getUserData } = useAuth();   
      const { dispatch, navigate, isUserLogin, loader, Link } = props
      const [formdata, setFormdata] = useReducer((state, newState) => ({ ...state, ...newState }),
          {
              carsList: EMPTY_ARRAY,             
          }
      );
  return (
    <>

      {loader ? <LoaderSpiner /> : <section class="card-block" aria-label="Preview Card">
        <h4>Brand page</h4>

      </section>}
    </>
  );
}

Brand.propTypes = {
  dispatch: PropTypes.func,
  data: PropTypes.object,
  loader: PropTypes.bool,
  userDetails: EMPTY_OBJECT,

}

Brand.defaulProps = {
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

export default connect(mapStateToProps)(Brand)