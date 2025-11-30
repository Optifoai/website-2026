import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {  EMPTY_OBJECT } from '../../utils/helpers';

function CreditsPageDemo(props) {

  return (
    <>  
    
    <section class="card-block" aria-label="Preview Card">

               <h4>CreditsPageDemo page</h4> 
            </section>
</>
  );
}

CreditsPageDemo.propTypes = {
    dispatch: PropTypes.func,
    data: PropTypes.object,
    loader: PropTypes.bool,
    userDetails: EMPTY_OBJECT, 

}

CreditsPageDemo.defaulProps = {
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

export default connect(mapStateToProps)(CreditsPageDemo)