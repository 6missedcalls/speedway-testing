import { configureStore } from "@reduxjs/toolkit"
import authenticationReducer from "./slices/authenticationSlice"
import { getAppStateFromLocalCache, syncAppStateToLocalCache } from "../utils/localStorage";

const emptyState = {
	authentication: {
		isLogged: false,
		loading: false,
		error: false
	}
}

// TODO: get address from server if it exists and compare to local cache address, if they are the same we can set the local cache to the app state
// const cachedState = getAppStateFromLocalCache()

const initialState =  emptyState

export const store = configureStore({
	reducer: {
		authentication: authenticationReducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
	preloadedState: initialState 
})

store.subscribe(() => {
	syncAppStateToLocalCache(store.getState())
});
   

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
