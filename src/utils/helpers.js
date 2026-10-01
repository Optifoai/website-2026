
import React from 'react'
// import { toast } from 'react-toastify'
import STORAGE_KEY from '../constants/storageKey'
import {toast, Bounce } from 'react-toastify';
import moment from 'moment';
import { Config } from '../services/config';


export const EMPTY_ARRAY = Object.freeze([])
export const EMPTY_OBJECT = Object.freeze({})
export const EMPTY_STRING = ''

export function getLoggedInUserId() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY.USER_DETAILS)
    if (!raw) return null
    const profile = JSON.parse(raw)
    return profile?._id || profile?.id || null
  } catch {
    return null
  }
}

export function getCarThumbnailUrl(car) {
  if (!car) return ''

  if (car.thumbnailUrl && String(car.thumbnailUrl).trim() !== '') {
    return String(car.thumbnailUrl).trim()
  }

  const images = car?.carImages || []
  const priority = ['FrontL', 'Front', 'FrontR']
  for (let i = 0; i < priority.length; i++) {
    const img = images.find((entry) => entry?.partName === priority[i])
    if (img?.partUrl && String(img.partUrl).trim() !== '') {
      return String(img.partUrl).trim()
    }
  }

  const match = images.find((img) => img?.partUrl && String(img.partUrl).trim() !== '')
  return match?.partUrl || ''
}

export function hasCarThumbnail(car) {
  return Boolean(getCarThumbnailUrl(car))
}

const CAR_PROCESSING_TERMINAL = new Set(['completed', 'failed'])

export function isCarProcessing(car) {
  const status = car?.processingStatus
  if (!status || CAR_PROCESSING_TERMINAL.has(status)) {
    return false
  }
  return true
}

export function getCarProcessingLabel(status) {
  const labels = {
    queued: 'Queued',
    processing: 'Processing',
    uploading: 'Uploading Images',
    background_removed: 'Removing Background',
    ai_processing: 'Generating AI',
    completed: 'Completed',
    failed: 'Failed',
  }
  return labels[status] || 'Processing'
}

export function shouldShowCarOnDashboard(car) {
  return hasCarThumbnail(car) || isCarProcessing(car)
}


export const setLoginDetailInSession = (loggedInUserData) => {
  const userData = [
    {
      key: STORAGE_KEY.ACCESS_TOKEN,
      value: loggedInUserData?.accessToken,
    },
    {
      key: STORAGE_KEY.REFRESH_TOKEN,
      value: loggedInUserData?.refreshToken,
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
  userData.forEach((data) => {
    if (data.value !== undefined && data.value !== null) {
      localStorage.setItem(data.key, JSON.stringify(data.value))
    }
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

export const getRefreshToken = () => {
  try {
    const token = localStorage.getItem('refreshToken')
    if (!token) return null
    return JSON.parse(token)
  } catch {
    localStorage.removeItem('refreshToken')
    return null
  }
}

export const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', JSON.stringify(token))
  }
}

export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem('refreshToken', JSON.stringify(token))
  }
}

export const clearAuthStorage = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('userData')
  localStorage.removeItem('visit')
}

/** Server origin used to turn /uploads/... localPath into an absolute URL. */
export function getServerOrigin() {
  const configured = Config.serverUrl || import.meta.env.VITE_MEDIA_BASE_URL
  if (configured) return String(configured).replace(/\/$/, '')

  const api = Config.serverAPIUrl || ''
  return api.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '')
}

/**
 * Display URL for background / logo / banner / plate assets.
 * Prefer imageUrl when present; otherwise build from localPath; else S3.
 */
export function getMediaDisplayUrl(itemOrPath) {
  if (!itemOrPath) return ''

  if (typeof itemOrPath === 'string') {
    if (/^https?:\/\//i.test(itemOrPath) || itemOrPath.startsWith('blob:')) {
      return itemOrPath
    }
    if (itemOrPath.startsWith('/')) {
      return `${getServerOrigin()}${itemOrPath}`
    }
    return itemOrPath
  }

  if (itemOrPath.imageUrl) return itemOrPath.imageUrl

  const localPath = itemOrPath.localPath
  if (localPath) {
    if (/^https?:\/\//i.test(localPath)) return localPath
    const path = localPath.startsWith('/') ? localPath : `/${localPath}`
    return `${getServerOrigin()}${path}`
  }

  if (itemOrPath.s3Key) {
    return `${getServerOrigin()}/uploads/${String(itemOrPath.s3Key).replace(/^\//, '')}`
  }

  return itemOrPath.backgroundImage || itemOrPath.s3Url || ''
}

/** Normalize create-car API response (sync success or async job queue). */
export function parseCarCreateResponse(res) {
  if (!res) return null
  const data = res.responseData || res
  const jobId = res.jobId || data.jobId || data.job?.id
  const vehicleId = res.vehicleId || data.vehicleId || data.vehicleMongoId || res.carId || data.carId
  const statusCode = res.statusCode ?? data.statusCode
  const errorMessage = res?.error?.responseMessage || data?.error?.responseMessage
  const hasExplicitError = statusCode == '0' || statusCode === 0 || Boolean(errorMessage)
  const hasSuccessCode = statusCode == '1' || statusCode == 1
  // Legacy addcar route returns { message, car } without statusCode (see web-crm carsRoute /addcar)
  const apiSuccess = res.success === true || data.success === true
  const hasLegacySuccess =
    !hasExplicitError &&
    (apiSuccess || Boolean(res?.message || data?.message || res?.car || data?.car || jobId || vehicleId))
  const success = hasSuccessCode || hasLegacySuccess

  return {
    jobId,
    vehicleId,
    isAsyncJob: Boolean(jobId || res.processingStatus === 'queued' || data.processingStatus === 'queued'),
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
        vehicleId: data.vehicleId || res.vehicleId,
        status: data.status || res.status,
        totalImages: data.totalImages ?? res.totalImages,
        processedImages: data.processedImages ?? res.processedImages ?? 0,
        currentImage: data.currentImage || res.currentImage,
        errorMessage: data.errorMessage || res.errorMessage,
        phase: data.phase || res.phase,
        result: data.result || res.result,
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


