import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {  EMPTY_OBJECT ,notify} from '../../utils/helpers';
import {getUserProfile} from '../../Redux/Actions/loginAction'
import { useEffect,useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

function ProfilePage(props) {
  const { user } = useAuth();
  const { dispatch,navigate ,isUserLogin,loader} = props  
  const [userData, setUserData] = useState(EMPTY_OBJECT);
    useEffect(() => {
        if (!isUserLogin) {
            navigate('/')
        }
        dispatch(getUserProfile()).then((res) => {
            if (res) {           
                localStorage.setItem('userData', JSON.stringify(res))
                setUserData(res)
                notify('success','User data fetched successfully')
            } else {
                notify('error','User data fetched successfully')
                localStorage.setItem('userData', '{}')
            }
        })
    }, [EMPTY_OBJECT])


  if (userData === EMPTY_OBJECT) {
    return (
      <div>
        <h2>Profile Page</h2>
        <p>Loading user data or user not found...</p>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h2>User Profile</h2>
      <p><strong>Username:</strong> {userData?.fullName || 'Not available'}</p>
      <p><strong>Email:</strong> {userData?.email || 'Not available'}</p>
      <br />
      <ToastContainer />
      <Link to="/dashboard">Back to Dashboard</Link>
    </div>
  );
}

ProfilePage.propTypes = {
    dispatch: PropTypes.func,
    userDetails: PropTypes.object,
    loader: PropTypes.bool,

}

ProfilePage.defaulProps = {
    dispatch: PropTypes.func,
    userDetails: EMPTY_OBJECT,   
    loader: PropTypes.bool,

}

function mapStateToProps({ login }) {
    return {
        userDetails: login?.userDetails,
        isUserLogin: login?.isUserLogin,
    }
}

// export default ProfilePage;
export default connect(mapStateToProps)(ProfilePage)