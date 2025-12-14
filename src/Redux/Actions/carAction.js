import CONSTANTS from '../Constants'
import { postRequest, getRequest, deleteRequest } from '../../services'
import { APICONFIG } from '../ApiConfig'


// Calls the API to get Car List

export const getCarList = (params = {}) => (dispatch) => {
  dispatch({ type: CONSTANTS.GET_CAR_LIST_REQUEST })
  const { page = 1, limit = 10 } = params;
  let apiurl = `${APICONFIG.getCarListUrl}?catagory=date&page=${page}&limit=${limit}`
  return getRequest(apiurl).then((res) => {
    dispatch({ type: CONSTANTS.GET_CAR_LIST_SUCCESS, data: res })
    return res
  }).catch((err) => {
    let errObject = err 
    dispatch({ type: CONSTANTS.GET_CAR_LIST_FAILURE })
  })
}

// Calls the API to get Car Details
export const getCarDetails = (vehicleId) => (dispatch) => {
  dispatch({ type: CONSTANTS.GET_CAR_DETAILS_REQUEST })
  let apiurl = `${APICONFIG.getCarDetailsUrl}?vehicleId=${vehicleId}`
  return getRequest(apiurl).then((res) => {
    dispatch({ type: CONSTANTS.GET_CAR_DETAILS_SUCCESS, data: res })
    return res
  }).catch((err) => {
    let errObject = err 
    dispatch({ type: CONSTANTS.GET_CAR_DETAILS_FAILURE })
  })
}

// Calls the API to get Car download all image
export const getAllCarImages = (payload) => (dispatch) => {
  console.log('payload',payload)
  dispatch({ type: CONSTANTS.GET_CAR_COMMON_REQUEST })
  let apiurl = `${APICONFIG.getAllCarImageDownloadUrl}`
  return postRequest(apiurl,payload).then((res) => {
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_SUCCESS, data: res })
    return res
  }).catch((err) => {
    let errObject = err 
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_FAILURE })
  })
}

// Calls the API to get Car download all image
export const getAllCarVideo = (payload) => (dispatch) => {
  console.log('payload',payload)
  dispatch({ type: CONSTANTS.GET_CAR_COMMON_REQUEST })
  let apiurl = `${APICONFIG.getAllCarVideoDownloadUrl}`
  return postRequest(apiurl,payload).then((res) => {
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_SUCCESS, data: res })
    return res
  }).catch((err) => {
    let errObject = err 
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_FAILURE })
  })
}


// Calls the API to get Car delete
export const getCarDelete = (payLoad) => (dispatch) => {
  dispatch({ type: CONSTANTS.GET_CAR_DELETE_REQUEST })
  let apiurl = `${APICONFIG.getCarDeleteAPIUrl}`
  return postRequest(apiurl,payLoad).then((res) => {
    dispatch({ type: CONSTANTS.GET_CAR_DELETE_SUCCESS, data: res })
    return res
  }).catch((err) => {
    let errObject = err 
    dispatch({ type: CONSTANTS.GET_CAR_DELETE_FAILURE })
  })
}


// Calls the API to get Car delete
export const UploadCarVideoAPIUrl = (payLoad) => (dispatch) => {
  dispatch({ type: CONSTANTS.GET_CAR_COMMON_REQUEST })
  let apiurl = `${APICONFIG.UPLOAD_CAR_VIDEO}`
  return postRequest(apiurl,payLoad).then((res) => {
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_SUCCESS, data: res })
    return res
  }).catch((err) => {
    let errObject = err 
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_FAILURE })
  })
}


// Calls the API to get Car delete
export const generateAImageAPI = (payLoad) => (dispatch) => {
  dispatch({ type: CONSTANTS.GET_CAR_COMMON_REQUEST })
  let apiurl = `${APICONFIG.CREAT_AI_IMAGE}`
  return postRequest(apiurl,payLoad).then((res) => {
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_SUCCESS, data: res })
    return res
  }).catch((err) => {
    let errObject = err 
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_FAILURE })
  })
}

// Calls the API to get Car delete
export const generate360ImageAPI = (payLoad) => (dispatch) => {
  dispatch({ type: CONSTANTS.GET_CAR_COMMON_REQUEST })
  let apiurl = `${APICONFIG.CREAT_360CAR_IMAGE}`
  return postRequest(apiurl,payLoad).then((res) => {
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_SUCCESS, data: res })
    return res
  }).catch((err) => {
    let errObject = err 
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_FAILURE })
  })
}

export const getCarBrandList = () => (dispatch) => {
  dispatch({ type: CONSTANTS.GET_CAR_COMMON_REQUEST })
  let apiurl = `${APICONFIG.CAR_BRANDS}`
  return getRequest(apiurl).then((res) => {
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_SUCCESS, data: res })
    return res
  }).catch((err) => {
    let errObject = err 
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_FAILURE })
  })
}

// Calls the API to get Car delete
export const updateCarDetails = (payLoad) => (dispatch) => {
  dispatch({ type: CONSTANTS.GET_CAR_COMMON_REQUEST })
  let apiurl = `${APICONFIG.CAR_UPDATE}`
  return postRequest(apiurl,payLoad).then((res) => {
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_SUCCESS, data: res })
    return res
  }).catch((err) => {
    let errObject = err 
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_FAILURE })
  })
}

// Calls the API to get Car delete
export const updateCarBackground = (payLoad) => (dispatch) => {
  dispatch({ type: CONSTANTS.GET_CAR_COMMON_REQUEST })
  let apiurl = `${APICONFIG.SET_BACKGROUND}`
  return postRequest(apiurl,payLoad).then((res) => {
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_SUCCESS, data: res })
    return res
  }).catch((err) => {
    let errObject = err 
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_FAILURE })
  })
}


// Calls the API to get Car delete
export const actionBackgroundDelete = (payLoad) => (dispatch) => {
  dispatch({ type: CONSTANTS.GET_CAR_DELETE_REQUEST })
  let apiurl = `${APICONFIG.DELETE_BACKGROUND}`
  return postRequest(apiurl,payLoad).then((res) => {
    dispatch({ type: CONSTANTS.GET_CAR_DELETE_SUCCESS, data: res })
    return res
  }).catch((err) => {
    let errObject = err 
    dispatch({ type: CONSTANTS.GET_CAR_DELETE_FAILURE })
  })
}

// Calls the API to get Car delete
export const uploadBackground = (payLoad,obj='') => (dispatch) => {
  dispatch({ type: CONSTANTS.GET_CAR_COMMON_REQUEST })
  let apiurl = `${APICONFIG.UPLOAD_BACKGROUND}`
  if(obj && obj!=''){
    apiurl = `${APICONFIG.UPLOAD_BACKGROUND}?${obj}`
  }else{
    apiurl = `${APICONFIG.UPLOAD_BACKGROUND}?backgroundType=${payLoad.backgroundType}`
    delete payLoad.backgroundType
  }
  
  
  return postRequest(apiurl,payLoad).then((res) => {
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_SUCCESS, data: res })
    return res
  }).catch((err) => {
    let errObject = err 
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_FAILURE })
  })
}


// Calls the API to get Car List

export const getBrandList = () => (dispatch) => {
  dispatch({ type: CONSTANTS.GET_CAR_COMMON_REQUEST })
  let apiurl = `${APICONFIG.getCarListUrl}?catagory=date`
  return getRequest(apiurl).then((res) => {
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_SUCCESS, data: res })
    return res
  }).catch((err) => {
    let errObject = err 
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_FAILURE })
  })
}

// Calls the API to get Car List

export const getBrandDetails = (folderName) => (dispatch) => {
  dispatch({ type: CONSTANTS.GET_CAR_COMMON_REQUEST })
  let apiurl = `${APICONFIG.getCarListUrl}?catagory=folder&folderName=${folderName}&searchKeyword=`
  return getRequest(apiurl).then((res) => {
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_SUCCESS, data: res })
    return res
  }).catch((err) => {
    let errObject = err 
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_FAILURE })
  })
}


// Calls the API to create car
export const createCarSave = (payLoad) => (dispatch) => {
  dispatch({ type: CONSTANTS.GET_CAR_COMMON_REQUEST })
  let apiurl = `${APICONFIG.CREAT_CAR}`
  return postRequest(apiurl,payLoad).then((res) => {
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_SUCCESS, data: res })
    return res
  }).catch((err) => {
    dispatch({ type: CONSTANTS.GET_CAR_COMMON_FAILURE })
  })
}

