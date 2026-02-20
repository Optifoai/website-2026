import axios from 'axios'
// import { notify } from '../utils/helpers'
// import { getConfigDetails } from './config'
// import { getConfigDetails } from '../redux/config/Config'
const axiosClient = axios.create()

// Intercept request
axiosClient.interceptors.request.use(
	(request) => {
		const accessToken = localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null       
        const authorization = import.meta.env.VITE_PUBLIC_AUTHORIZATION;
		  // If payload is FormData, don't set content type
			if (request.data instanceof FormData) {
			delete request.headers['Content-Type'];  
			} else {
			request.headers['Content-Type'] = 'application/json';
			}
        request.headers['Authorization'] = `${authorization}`
		request.headers['accessToken'] = accessToken ? accessToken: ''
		return request
	},
	null,
	{ synchronous: true }
)

// Intercept response
axiosClient.interceptors.response.use(
	(response) => {
		// const userData = JSON.parse(localStorage.getItem('userData'))
		const accessToken = JSON.parse(localStorage.getItem('authToken'))        

		// Dispatch any action on success
		//if(response?.status === responseCodes.SUCCESS200)
		if (response?.status == 201 || response?.status == 200) {
			if(response?.data?.error?.responseMessage && response?.data?.error?.responseMessage=='Your Token has been expired'){
				// notify('error', 'Session Expired, Please Login Again')
				localStorage.clear()
				sessionStorage.clear()
				setTimeout(() => {
					window.location.replace(`/login`)
				}, 5000)
			}else{
			return response?.data
			}
		}else if(response?.status == 401){
			if(accessToken && accessToken != null){
				// notify('error', 'Session Expired, Please Login Again')
				localStorage.clear()
				sessionStorage.clear()
				setTimeout(() => {
					window.location.replace(`/login`)
				}, 5000)
			}else{
				return	Promise.reject(response?.data)	
			}
			
		}else{
			return	Promise.reject(response?.data)
		}
	}
	,
	(error) => {
		// const userData = JSON.parse(localStorage.getItem('userData'))
		const accessToken = JSON.parse(localStorage.getItem('authToken'))        


		if(error?.response?.status == 401){
			if(accessToken && accessToken != null){
				// notify('error', 'Session Expired, Please Login Again')
				localStorage.clear()
				sessionStorage.clear()
				setTimeout(() => {
					window.location.replace(`/login`)
				}, 5000)
			}else{
				return Promise.reject(error?.response?.data)
			}
		}else{
			return Promise.reject(error?.response?.data)
		}
	}
)

// 

// axiosClient.defaults.baseURL ="";

axiosClient.defaults.headers = {
	// 'Content-Type': 'application/json',
	Accept: 'application/json',
}

// All request will wait 1 min before timeout
axiosClient.defaults.timeout = 60000

// axiosClient.defaults.withCredentials = true;

export default axiosClient
