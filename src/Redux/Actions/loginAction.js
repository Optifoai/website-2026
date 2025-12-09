import CONSTANTS from '../Constants'
import { postRequest, getRequest, putRequest } from '../../services'
import { APICONFIG } from '../ApiConfig'


// Calls the API to get user token
export const userLogin = (creds) => (dispatch) => {
  dispatch({ type: CONSTANTS.LOGIN_REQUEST })
  return postRequest(APICONFIG.getUserLoginUrl, creds).then((res) => {
    let resObject = { ...creds, ...res }
    dispatch({ type: CONSTANTS.LOGIN_SUCCESS, data: res })
    return res
  }).catch((err) => {
    let errObject = { ...creds, ...err }
    dispatch({ type: CONSTANTS.LOGIN_FAILURE })
    return err
  })
}

export const userSignup = (creds) => (dispatch) => {
  dispatch({ type: CONSTANTS.LOGIN_REQUEST })
  return postRequest(APICONFIG.getUserSignupUrl, creds).then((res) => {
    let resObject = { ...creds, ...res }
    dispatch({ type: CONSTANTS.LOGIN_SUCCESS, data: res })
    return res
  }).catch((err) => {
    let errObject = { ...creds, ...err }
    dispatch({ type: CONSTANTS.LOGIN_FAILURE })
    return err
  })
}

export const getUserProfile = () => (dispatch) => {
  dispatch({ type: CONSTANTS.GET_USER_PROFILE_REQUEST });

  return getRequest(APICONFIG.getUserProfileUrl)
    .then((res) => {
      dispatch({
        type: CONSTANTS.GET_USER_PROFILE_SUCCESS,
        data: res?.responseData?.userProfile,
      });
      return res;   // ✅ RETURN full response
    })
    .catch((err) => {
      dispatch({ type: CONSTANTS.GET_USER_PROFILE_FAILURE });
      return Promise.reject(err); // ✅ return error so component catch works
    });
};

// export const getUserProfile = () => (dispatch) => {
//   dispatch({ type: CONSTANTS.GET_USER_PROFILE_REQUEST })
//   return getRequest(APICONFIG.getUserProfileUrl).then((res) => {
//     console.log('getUserProfile action res',res)
//     dispatch({ type: CONSTANTS.GET_USER_PROFILE_SUCCESS, data: res?.responseData?.userProfile })
//     // return res?.responseData?.userProfile
//   }).catch((err) => {
//     let errObject = err 
//     dispatch({ type: CONSTANTS.GET_USER_PROFILE_FAILURE })
//   })
// }

export const updateUserProfile = (creds) => (dispatch) => {
  dispatch({ type: CONSTANTS.LOGIN_REQUEST })
  return putRequest(APICONFIG.USER_PROFILE_INFO_UPDATE, creds).then((res) => {
    let resObject = { ...creds, ...res }
    dispatch({ type: CONSTANTS.LOGIN_SUCCESS, data: res })
    return res
  }).catch((err) => {
    let errObject = { ...creds, ...err }
    dispatch({ type: CONSTANTS.LOGIN_FAILURE })
    return err
  })
}



