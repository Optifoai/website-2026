import CONSTANTS from '../Constants'

const INITIAL_STATE = {
	loader: false,
	hasError: false,
	data: {},
	errorMessage: '',
}

const carReducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {

		//  GET CAR DETAILS
		case CONSTANTS.GET_CAR_LIST_REQUEST:
			return {
				...state,
				loader: true,
				errorMessage: ''
			}
		case CONSTANTS.GET_CAR_LIST_SUCCESS:
			return {
				...state,
				loader: false,
				data: action.data,
				hasError: false,
				errorMessage: ''
			}
		case CONSTANTS.GET_CAR_LIST_FAILURE:
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

export default carReducer
