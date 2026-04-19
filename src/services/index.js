import axios from 'axios'

import axiosClient from './base'
import { client } from './axioConfig'
// import { getConfigDetails } from './config'

export function getRequest(URL) {
	return axiosClient.get(URL)
}

export function postRequest(URL, payload) {
	const isMasquerade = localStorage.getItem('masquerade')

	// Check if the payload is a FormData object
	if (payload instanceof FormData) {
		if (isMasquerade) {
			payload.append('initiator_id', isMasquerade)  // Directly append to FormData
		}
	} else if (typeof payload === 'object' && payload !== null) {
		let editPayload = { ...payload }
		if (isMasquerade) {
			editPayload['initiator_id'] = isMasquerade
		}
		payload = editPayload  // Assign the modified object back to payload
	}

	return axiosClient.post(URL, payload)
}

export function patchRequest(URL, payload) {
	return axiosClient.patch(URL, payload)
}

export function deleteRequest(URL) {
	return axiosClient.delete(URL)
}

export function putRequest(URL, payload) {
	const isMasquerade = localStorage.getItem('masquerade')

	// Check if the payload is a FormData object
	if (payload instanceof FormData) {
		if (isMasquerade) {
			payload.append('initiator_id', isMasquerade)  // Directly append to FormData
		}
	} else if (typeof payload === 'object' && payload !== null) {
		let editPayload = { ...payload }
		if (isMasquerade) {
			editPayload['initiator_id'] = isMasquerade
		}
		payload = editPayload  // Assign the modified object back to payload
	}

	return axiosClient.put(URL, payload)
}

export function allRequest(allRequests) {
	return axios.all(allRequests).then(
		axios.spread(
			(...responses) => responses
			// use/access the results
		)
	)
}

export function downloadFile(path, payload, fileName) {
	return axios({
		url: path,
		method: 'GET',
		responseType: 'blob', // important
		data: payload,
		headers: {
			'Content-Type': 'application/json',
		}
	}).then((response) => {
		const status = response.status
		const url = window.URL.createObjectURL(new Blob([response.data]))
		const link = document.createElement('a')
		link.href = url
		link.setAttribute('download', fileName)
		document.body.appendChild(link)
		link.click()
		// Clean up and remove the link
		link.parentNode.removeChild(link)
		if (status === 201 || status === 200) {
		return { status: status, data: 'File downloaded successfully' }
		}else{
			return { status: status, data: response ? response :'Sorry! Please try again.' }
		}  
	}).catch(() => {
		return { status: 500, data: 'Something went wrong, Please try again!' }
	})
}

export function postRequestData(URL, payload,token) {
	let header={
            headers: {
              accessToken: token
            }
          }
	return client.post(URL, payload,header)
}
