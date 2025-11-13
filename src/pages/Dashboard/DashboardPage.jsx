import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button/Button';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {  EMPTY_OBJECT } from '../../utils/helpers';
// import noop from 'lodash/noop';

function DashboardPage(props) {
  const { user, logout } = useAuth();
  const {userDetails} = props
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-page">
      <h2>Welcome to your Dashboard, {userDetails?.fullName || 'User'}!</h2>
      <p>This is your private dashboard content.</p>
      <Button onClick={handleLogout}>Logout</Button>
      <p>
        <Button onClick={() => navigate('/profile')}>View Profile</Button>
      </p>
    </div>
  );
}

DashboardPage.propTypes = {
    dispatch: PropTypes.func,
    data: PropTypes.object,
    loader: PropTypes.bool,
    userDetails: EMPTY_OBJECT, 

}

DashboardPage.defaulProps = {
    dispatch: PropTypes.func,
    data: EMPTY_OBJECT,
    userDetails: EMPTY_OBJECT,    
    loader: PropTypes.bool,

}

function mapStateToProps({ login }) {
  console.log('dashboard login',login)
    return {
        isUserLogin: login?.isUserLogin,
        userDetails: login?.userDetails,
    }
}

export default connect(mapStateToProps)(DashboardPage)

// export default ;
