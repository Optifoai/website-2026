import { combineReducers } from 'redux'
import login from './login'
import carReducer from './carReducer'

export default combineReducers({
	login,
	carReducer,

})
