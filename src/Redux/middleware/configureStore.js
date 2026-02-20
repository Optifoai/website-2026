import { createStore, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk';
import rootReducer from '../Reducers'

const middlewares = [thunk]

// Function to load state from localStorage
const loadState = () => {
	try {
		const serializedState = localStorage.getItem('state');
		if (serializedState === null) {
			return undefined; // Let reducers initialize the state
		}
		return JSON.parse(serializedState);
	} catch (err) {
		// console.error("Could not load state", err);
		return undefined;
	}
};

// Function to save state to localStorage
const saveState = (state) => {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem('state', serializedState);
	} catch (err) {
		console.error("Could not save state", err);
	}
};

const persistedState = loadState();

export default function configureStore () {
	const store = createStore(rootReducer, persistedState, applyMiddleware(...middlewares))

	store.subscribe(() => {
		saveState(store.getState());
	});

	return store
}
