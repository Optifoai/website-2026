
import React from 'react'
// import { toast } from 'react-toastify'
import STORAGE_KEY from '../constants/storageKey'
import { ToastContainer, toast, Bounce } from 'react-toastify';


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

// export const notify = (type, message, heading = '') => {
//   const messagePass = (<div><h4>{heading}</h4><p>{message}</p></div>);
//   toast.dismiss()
//   if (type === 'error') {
//     toast.error(messagePass, {
//       position: toast.POSITION.TOP_RIGHT
//     })
//   } else if (type === 'success') {
//     toast.success(messagePass, {
//       position: toast.POSITION.TOP_RIGHT
//     })
//   }
// }
