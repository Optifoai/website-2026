import axios from 'axios'
// import { notify } from '../utils/helpers'
// import { getConfigDetails } from './config'
// import { getConfigDetails } from '../redux/config/Config'
const axiosClient = axios.create()
const partner = window.location.toString().split('/')[3]

// Intercept request
axiosClient.interceptors.request.use(
	(request) => {
		const accessToken = JSON.parse(localStorage.getItem('authToken'))        
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
		const userData = JSON.parse(localStorage.getItem('userData'))
		// Dispatch any action on success
		//if(response?.status === responseCodes.SUCCESS200)
		if (response?.status == 201 || response?.status == 200) {
			return response?.data
		}else if(response?.status == 401){
			if(userData?.access_token && userData?.access_token != null){
				// notify('error', 'Session Expired, Please Login Again')
				localStorage.clear()
				sessionStorage.clear()
				setTimeout(() => {
					window.location.replace(`/${partner}`)
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
		const userData = JSON.parse(localStorage.getItem('userData'))

		if(error?.response?.status == 401){
			if(userData?.access_token && userData?.access_token != null){
				// notify('error', 'Session Expired, Please Login Again')
				localStorage.clear()
				sessionStorage.clear()
				setTimeout(() => {
					window.location.replace(`/${partner}`)
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
