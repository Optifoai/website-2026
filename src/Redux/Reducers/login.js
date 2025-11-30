import CONSTANTS from '../Constants'

const INITIAL_STATE = {
	loader: false,
	isUserLogin: false,
	isAuthenticated: false,
	hasError: false,
	data: {},
	email: null,
	errorMessage: '',
	id: null,
	userDetails: {},
}

const loginReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {

		//LOGIN HANDLING
		case CONSTANTS.LOGIN_REQUEST:
			return {
				...state,
				loader: true,
				errorMessage: ''
			}
		case CONSTANTS.LOGIN_SUCCESS:
			return {
				...state,
				loader: false,
				data: action.data.responseData,
				userDetails: action.data.responseData,
				isAuthenticated: true,
				isUserLogin: true,
				hasError: false,
				errorMessage: ''
			}
		case CONSTANTS.LOGIN_FAILURE:
			return {
				...state,
				loader: false,
				errorMessage: 'There is some Error'
			}

		//  GET USER PROFILE DETAILS
		case CONSTANTS.GET_USER_PROFILE_REQUEST:
			return {
				...state,
				loader: true,
				errorMessage: ''
			}
		case CONSTANTS.GET_USER_PROFILE_SUCCESS:
			return {
				...state,
				loader: false,
				userDetails: action.data,
				isAuthenticated: true,
				isUserLogin: true,
				hasError: false,
				errorMessage: ''
			}
		case CONSTANTS.GET_USER_PROFILE_FAILURE:
			return {
				...state,
				loader: false,
				hasError: true,
				errorMessage: 'There is some Error'
			}
		//  GET USER DATA DETAILS
		case CONSTANTS.GET_USER_DATA_REQUEST:
			return {
				...state,
				loader: true,
				errorMessage: ''
			}
		case CONSTANTS.GET_USER_DATA_SUCCESS:
			return {
				...state,
				loader: false,
				userDetails: action.data,
				hasError: false,
				errorMessage: ''
			}
		case CONSTANTS.GET_USER_DATA_FAILURE:
			return {
				...state,
				loader: false,
				hasError: true,
				errorMessage: 'There is some Error'
			}		
		default:
			return state
	}
}

export default loginReducer
