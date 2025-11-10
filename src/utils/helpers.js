
import React from 'react'
import { toast } from 'react-toastify'


export const setLoginDetailInSession = (loggedInUserData) => {
  const userData = [
    {
      key: STORAGE_KEY.ACCESS_TOKEN,
      value: loggedInUserData?.AccessToken,
    },
    {
      key: STORAGE_KEY.REFRESH_TOKEN,
      value: loggedInUserData?.RefreshToken,
    },
    {
      key: STORAGE_KEY.ID_TOKEN,
      value: loggedInUserData?.IdToken,
    },
    {
      key: STORAGE_KEY.TOKEN_TYPE,
      value: loggedInUserData?.TokenType,
    },
  ]
  setLocalStorage(userData)
}
