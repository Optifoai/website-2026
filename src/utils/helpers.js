
import React from 'react'
// import { toast } from 'react-toastify'
import STORAGE_KEY from '../constants/storageKey'
import {toast, Bounce } from 'react-toastify';
import moment from 'moment';


export const EMPTY_ARRAY = Object.freeze([])
export const EMPTY_OBJECT = Object.freeze({})

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
  return JSON.parse(localStorage.getItem(key))
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
  return date ? moment(date).format('DD-MM-YYYY') : '-'
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


