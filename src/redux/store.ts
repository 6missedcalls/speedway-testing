import { combineReducers, configureStore } from "@reduxjs/toolkit"
import authenticationReducer from "./slices/authenticationSlice"
import schemasReducer from "./slices/schemasSlice"
import {
	getAppStateFromLocalCache,
	syncAppStateToLocalCache,
} from "../utils/localStorage"
import { ROOT_INITIALIZE_FROM_CACHE, ROOT_RESET } from "../utils/constants"

const emptyState = {
	authentication: {
		isLogged: false,
		loading: false,
		error: false,
		Address: "",
	},
	schemas: {
		list: [],
		loading: false,
		error: false,
		getSchemaLoading: false,
	},
}

const initialState = emptyState

const combinedReducer = combineReducers({
	authentication: authenticationReducer,
	schemas: schemasReducer,
})

const rootReducer = (state: any, action: any) => {
	if (action.type === ROOT_RESET) {
		state = emptyState
	} else if (action.type === ROOT_INITIALIZE_FROM_CACHE) {
		state = getAppStateFromLocalCache()
	}
	return combinedReducer(state, action)
}

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({ serializableCheck: false }),
	preloadedState: initialState,
})

store.subscribe(() => {
	syncAppStateToLocalCache(store.getState())
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
