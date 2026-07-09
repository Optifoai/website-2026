
import React from 'react'
// import { toast } from 'react-toastify'
import STORAGE_KEY from '../constants/storageKey'
import {toast, Bounce } from 'react-toastify';
import moment from 'moment';


export const EMPTY_ARRAY = Object.freeze([])
export const EMPTY_OBJECT = Object.freeze({})
export const EMPTY_STRING = ''


export const setLoginDetailInSession = (loggedInUserData) => {
  const userData = [
    {
      key: STORAGE_KEY.ACCESS_TOKEN,
      value: loggedInUserData?.accessToken,
    },
    {
      key: STORAGE_KEY.USER_DETAILS,
      value: loggedInUserData?.userProfile,
    },
     {
      key: STORAGE_KEY.VISIT_FIRST,
      value: true,
    }
  ]
  setLocalStorage(userData)
}

const setLocalStorage = (userData) => {
  userData.map((data) => {
    localStorage.setItem(data.key, JSON.stringify(data.value))
  })
}

export const notify = (type, message, heading = '') => {
  if (type === 'success') {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  } else if (type === 'error') {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  }
}

export const getLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key)
    if (item === null) return null
    return JSON.parse(item)
  } catch {
    return null
  }
}

export const getAccessToken = () => {
  try {
    const token = localStorage.getItem('authToken')
    if (!token) return null
    return JSON.parse(token)
  } catch {
    localStorage.removeItem('authToken')
    return null
  }
}

/** Normalize create-car API response (sync success or async job queue). */
export function parseCarCreateResponse(res) {
  if (!res) return null
  const data = res.responseData || res
  const jobId = res.jobId || data.jobId || data.job?.id
  const statusCode = res.statusCode ?? data.statusCode
  const errorMessage = res?.error?.responseMessage || data?.error?.responseMessage
  const hasExplicitError = statusCode == '0' || statusCode === 0 || Boolean(errorMessage)
  const hasSuccessCode = statusCode == '1' || statusCode == 1
  // Legacy addcar route returns { message, car } without statusCode (see web-crm carsRoute /addcar)
  const hasLegacySuccess =
    !hasExplicitError &&
    Boolean(res?.message || data?.message || res?.car || data?.car)
  const success = hasSuccessCode || hasLegacySuccess

  return {
    jobId,
    isAsyncJob: Boolean(jobId),
    success,
    status: data.status || res.status || 'pending',
    totalImages: data.totalImages ?? res.totalImages,
    processedImages: data.processedImages ?? res.processedImages ?? 0,
    message: res.message || data.message,
    phase: data.phase || res.phase,
  }
}

/** Normalize car image job status polling response. */
export function parseCarJobStatusResponse(res) {
  if (!res) return null
  const data = res.responseData || res
  return {
    jobId: data.jobId || res.jobId,
    status: data.status || res.status,
    totalImages: data.totalImages ?? res.totalImages,
    processedImages: data.processedImages ?? res.processedImages ?? 0,
    currentImage: data.currentImage || res.currentImage,
    errorMessage: data.errorMessage || res.errorMessage,
    phase: data.phase || res.phase,
  }
}

export const removeLocalStorage = (key) => {
  localStorage.removeItem(key)
}

export const clearLocalStorage = () => {
  localStorage.clear()
}   

export const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === '') === 'string' && value.trim().length === 0
  )
}

export const isNotEmpty = (value) => {
  return !isEmpty(value)
} 

export const displayDateTimeFormat = (date) => {  
  return date ? moment(date).format('DD-MM-YYYY HH:mm') : '-'
}

export const displayDateFormat = (date) => {  
  return date ? moment(date).format('hh:mmA ,D MMM YYYY') : '-'
}

export const ResponseFilter = (response) =>  {
  var serverResponseStatus = response.status;
  var serverResponseData =
    typeof response.data != 'undefined'
      ? response.data
      : typeof response.error != 'undefined'
      ? response.error
      : null;

  if (
    serverResponseData.statusCode === 0 &&
    serverResponseData.error &&
    serverResponseData.error.errorCode === 2
  ) {
    sessionStorage.removeItem('accessToken');
  }
  return {
    serverResponseStatus,
    serverResponseData,
  };
}

export const formDataToJson = (formData) => {

  const formObject = {}
  formData.forEach((value, key) => {
    // Check if the key already exists
    if (!Object.prototype.hasOwnProperty.call(formObject, key)) {
      formObject[key] = value
      return
    }
    // If the key exists and it's not an array, convert it to an array
    if (!Array.isArray(formObject[key])) {
      formObject[key] = [formObject[key]]
    }
    // Add the new value to the array
    formObject[key].push(value)
  })
  return formObject
}

export const handleDownloadfile = (blob, filename) => {
  if (window.navigator && window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = URL.createObjectURL(blob);
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
  }
};


  export const carTypes = ['Mini', 'Hatchback', 'Sedan', 'Wagon', 'SUV', 'Van', 'Convertible'];
  export const carPositions = ['Front','Back','FrontR','FrontL','BackR','BackL','SideR','SideL','FrontSeats','RearSeats','Dashboard','Wheel','Exterior','Interior'];
  export const numberPlatePositions = ['Front', 'Back', 'FrontR', 'FrontL', 'BackR', 'BackL'];


