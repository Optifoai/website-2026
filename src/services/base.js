import axios from 'axios'
import {
	getAccessToken,
	getRefreshToken,
	setAccessToken,
	setRefreshToken,
	clearAuthStorage,
} from '../utils/helpers'
import { APICONFIG } from '../Redux/ApiConfig'

const axiosClient = axios.create()

let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error)
		} else {
			prom.resolve(token)
		}
	})
	failedQueue = []
}

function redirectToLogin() {
	const alreadyOnLogin = window.location.pathname === '/login'
	clearAuthStorage()
	sessionStorage.clear()
	if (alreadyOnLogin) {
		return
	}
	window.location.replace('/login')
}

function shouldAttemptRefresh(config) {
	if (!config || config._retry) {
		return false
	}
	const url = String(config.url || '')
	return !url.includes('user/login') && !url.includes('user/refresh-token')
}

async function refreshAccessToken() {
	const refreshToken = getRefreshToken()
	if (!refreshToken) {
		throw new Error('No refresh token')
	}

	const authorization = import.meta.env.VITE_PUBLIC_AUTHORIZATION
	const response = await axios.post(
		APICONFIG.REFRESH_TOKEN,
		{ refreshToken },
		{
			headers: {
				Authorization: authorization,
				'Content-Type': 'application/json',
			},
		}
	)

	const payload = response?.data?.responseData
	const newAccessToken = payload?.accessToken
	const newRefreshToken = payload?.refreshToken

	if (!newAccessToken) {
		throw new Error('Refresh token response missing accessToken')
	}

	setAccessToken(newAccessToken)
	if (newRefreshToken) {
		setRefreshToken(newRefreshToken)
	}

	return newAccessToken
}

async function handleUnauthorized(originalRequest) {
	if (!originalRequest) {
		if (getAccessToken()) {
			redirectToLogin()
		}
		return Promise.reject(new Error('Unauthorized'))
	}

	if (!shouldAttemptRefresh(originalRequest)) {
		if (getAccessToken()) {
			redirectToLogin()
		}
		return Promise.reject(originalRequest)
	}

	if (isRefreshing) {
		return new Promise((resolve, reject) => {
			failedQueue.push({ resolve, reject })
		}).then((token) => {
			originalRequest.headers['accessToken'] = token
			return axiosClient(originalRequest)
		})
	}

	originalRequest._retry = true
	isRefreshing = true

	try {
		const newAccessToken = await refreshAccessToken()
		processQueue(null, newAccessToken)
		originalRequest.headers['accessToken'] = newAccessToken
		return axiosClient(originalRequest)
	} catch (refreshError) {
		processQueue(refreshError, null)
		if (getAccessToken() || getRefreshToken()) {
			redirectToLogin()
		}
		return Promise.reject(refreshError)
	} finally {
		isRefreshing = false
	}
}

// Intercept request
axiosClient.interceptors.request.use(
	(request) => {
		const accessToken = getAccessToken()
		const authorization = import.meta.env.VITE_PUBLIC_AUTHORIZATION
		if (request.data instanceof FormData) {
			delete request.headers['Content-Type']
		} else {
			request.headers['Content-Type'] = 'application/json'
		}
		request.headers['Authorization'] = `${authorization}`
		request.headers['accessToken'] = accessToken ? accessToken : ''
		return request
	},
	null,
	{ synchronous: true }
)

// Intercept response
axiosClient.interceptors.response.use(
	async (response) => {
		if (
			response?.status == 201 ||
			response?.status == 200 ||
			response?.status == 202
		) {
			if (
				response?.data?.error?.responseMessage &&
				response?.data?.error?.responseMessage == 'Your Token has been expired'
			) {
				return handleUnauthorized(response.config)
			}
			return response?.data
		} else if (response?.status == 401) {
			return handleUnauthorized(response.config)
		}
		return Promise.reject(response?.data)
	},
	async (error) => {
		if (error?.response?.status == 401) {
			return handleUnauthorized(error.config)
		}
		return Promise.reject(error?.response?.data)
	}
)

axiosClient.defaults.headers = {
	Accept: 'application/json',
}

axiosClient.defaults.timeout = 60000

export default axiosClient
