import fetch from 'isomorphic-fetch';
import { makeRequest } from '../Actions/requests';
import configureStore from '../store';
// import { accessToken, getErrorMessage, extractApiGenericExceptionMessage } from '../Util/helpers';
import { errorMessages } from '../../Global/Constants/constants';
import { error, success } from '../Actions/notification'

const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
};

function buildHeaders(partnerSecret) {
    const accessToken = localStorage.getItem('authToken');
    const authorization = import.meta.env.VITE_PUBLIC_AUTHORIZATION;
    let headers = { ...defaultHeaders, Authorization: `Basic ${authorization}`,accessToken:accessToken };     
    // if (partnerSecret) headers['X-ClientSecret'] = partnerSecret
    return headers;
}

export function httpGet(url, params = {}) {

    const options = { headers: buildHeaders() };

    if (Object.keys(params).length) {
        const queryString = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
        url = `${url}?${queryString}`;
    }
    return configureStore().dispatch(makeRequest(url, options));
}


export function httpGetPdf(url) {
    let headers = buildHeaders();
    headers = { ...headers, 'Content-Type': 'application/octet-stream', 'Accept': 'application/pdf' };
    return fetch(url, {
        headers: headers
    })
        .then(
            (res) => { return res?.blob(); }
        )
        .then(
            (blob) => {
                return { data: URL.createObjectURL(blob) };
            }
        );
}

export function httpGetImage(url) {
    return fetch(url, {
        headers: buildHeaders()
    })
        .then((res) => {
            if (res?.status > 299) throw res;

            return res?.blob();
        })
        .then(
            (blob) => {
                return { data: URL.createObjectURL(blob) };
            }
        );
}


export function httpPost(url, data) {
    const options = {
        method: 'post',
        headers: buildHeaders(),
        body: JSON.stringify(data)
    };

    return configureStore().dispatch(makeRequest(url, options));
}

export function httpPut(url, data, partnerSecret) {
    let options = {}
    if (partnerSecret !== '' && partnerSecret !== undefined && partnerSecret !== null) {
        options = {
            method: 'put',
            headers: buildHeaders(partnerSecret),
            body: JSON.stringify(data)
        };
    } else {
        options = {
            method: 'put',
            headers: buildHeaders(),
            body: JSON.stringify(data)
        };
    }
    return configureStore().dispatch(makeRequest(url, options));
}

export function httpDelete(url, data) {
    const options = {
        method: 'delete',
        headers: buildHeaders(),
        body: JSON.stringify(data)
    };

    return configureStore().dispatch(makeRequest(url, options));
}



export function httpUpload(url, data) {
    return new Promise((resolve, reject) => {
        const formdata = new FormData();
        const masqurade_parent_id = localStorage.getItem('masqurade-parent-id');
        for (const key in data) {
            formdata.append(key, data[key]);
        }
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken.get()}`);
        xhr.setRequestHeader('Accept', 'application/json');
        // 
        // if (masqurade_parent_id) xhr.setRequestHeader('X-Masquerade-Parent-Id', convertKeyToBase64(masqurade_parent_id));

        xhr.onload = () => {
            const json = JSON.parse(xhr.response);
            return (xhr.status > 299) ? reject(json) : resolve(json);
        };

        xhr.onabort = () => reject(JSON.parse(xhr.response));
        xhr.onerror = () => reject(JSON.parse(xhr.response));

        xhr.send(formdata);
    });
}
export function downloadPostFile(url, filename, successConstant = null, payload, dispatch) {
    const options = {
        method: 'post',
        headers: buildHeaders(),
        body: JSON.stringify(payload)
    };
    return fetch(url, options).then(
        (res) => {
            if (res.status >= 400) {
                return handleServerError(res);
            } else {
                return res.blob()
            }
        }
    ).then(
        (blob) => {
            // this creates an invisible anchor tag that is programmatically clicked to download the file.
            if (blob.size > 0) {
                triggerFileDownload(blob, filename, successConstant);
            }
        }
    ).catch(() => {
        configureStore().dispatch(error('Error!', errorMessages.somethingWentWrong));
    });
}
export function downloadGetFile(url, filename, successConstant = null, dispatch = null) {
    const options = {
        method: 'get',
        headers: buildHeaders(),
    };
    return fetch(url, options).then(
        (res) => {
            if (res.status >= 400) {
                return handleServerError(res);
            } else {
                return res.blob()
            }
        }
    ).then((blob) => {
        // this creates an invisible anchor tag that is programmatically clicked to download the file.
        if (blob.size > 0) {
            triggerFileDownload(blob, filename, successConstant);
        }
    }).catch(() => {
        configureStore().dispatch(error('Error!', errorMessages.somethingWentWrong));
    });
}

export function download(url, filename, successConstant = null) {
    return fetch(url, {
        headers: buildHeaders()
    }).then(
        (res) => {
            if (res.status >= 400) {
                return handleServerError(res);
            } else {
                return res.blob()
            }
        }
    ).then(
        (blob) => {
            if (blob.size > 0) {
                triggerFileDownload(blob, filename, successConstant);
            }
        }
    ).catch(() => {
        configureStore().dispatch(error('Error!', errorMessages.somethingWentWrong));
    });
}

export function triggerFileDownload(blob, filename, successConstant) {
    if (window.navigator && window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, filename);
    } else {
        let a = document.createElement('a');
        a.style = "display: none";
        a.href = window.URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(a.href);
        a.remove();
        if (!successConstant) return;
        configureStore().dispatch({ type: successConstant });
    }
}

export function handleServerError(res) {
    return res.text().then((text) => {
        // Try parsing as JSON
        try {
            const json = JSON.parse(text);
            const errorMessage =
                json && json.errors && json.errors.message
                    ? getErrorMessage(json.errors)
                    : errorMessages.somethingWentWrong;
            if (res.status == 404) {
                configureStore().dispatch(success('', errorMessage));
            } else {
                configureStore().dispatch(error('Error!', errorMessage));
            }
            return false;
        } catch (e) {
            // Not JSON, process as HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const bodyContent = doc.body ? doc.body.innerText.trim() : 'No body content found';

            // Handle HTML or debug-like text responses
            let errorMessage = extractApiGenericExceptionMessage(bodyContent) || errorMessages.somethingWentWrong;
            if (e.status == 404) {
                configureStore().dispatch(success('', errorMessage));
            } else {
                configureStore().dispatch(error('Error!', errorMessage));
            }
            return false;
        }
    }).catch((err) => {
        if (err.status == 404) {
            configureStore().dispatch(success('', err ? (err.message ? err.message : errorMessages.somethingWentWrong) : errorMessages.somethingWentWrong));
        } else {
            configureStore().dispatch(error('Error!', err ? (err.message ? err.message : errorMessages.somethingWentWrong) : errorMessages.somethingWentWrong));
        }
        return false;
    });
}


export function redirectPage(url) {
    return window.location.replace(url)
}

export function convert(str) {
    let date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}


export function addOneDaytoCurrentDate(str) {
    if (!str) {
        let date = new Date(new Date().setDate(new Date().getDate() + 1)),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    } else if (str) {
        let date = new Date(str.setDate(str.getDate() + 1)),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    } else {
        return false
    }
}


export function getCurrentDay(index) {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = index;
    let day = weekday[d.getDay()];
    return day
}

export function addNoOFDays(days) {
    let myDate = new Date(new Date().getTime() + (days * 24 * 60 * 60 * 1000));
    return myDate
}

export function dateFormat(date) {
    const dateFormat = date.split("-").reverse().join("-");
    return dateFormat
}