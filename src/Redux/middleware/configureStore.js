import { createStore, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk';
import rootReducer from '../Reducers'

const middlewares = [thunk]
// if (process.env.NODE_ENV !== 'development') {
// 	const { logger } = require('redux-logger')
// 	middlewares.push(logger)
// }

export default function configureStore () {
	const store = createStore(rootReducer, applyMiddleware(...middlewares))
	return store
}
