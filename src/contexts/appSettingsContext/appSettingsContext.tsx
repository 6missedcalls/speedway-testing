import React, { createContext, Reducer, useReducer } from "react"
import { SET_MENU_IS_COLLAPSED } from "../../utils/constants"
import appSettingsReducer from "./appSettingsReducer"

interface AppSettingsProviderProps {
	children: React.ReactNode
}

export interface IappSettingsContextState {
    menuIsCollapsed: boolean
	setMenusIsCollapsed: (data: boolean) => void
}

const initialState = {
	menuIsCollapsed: false,
	setMenusIsCollapsed: (data: boolean) => {},
}

export const AppSettingsContext =
	createContext<IappSettingsContextState>(initialState)

export const AppSettingsProvider = ({ children }: AppSettingsProviderProps) => {
	const [state, dispatch] = useReducer<Reducer<any, any>>(
		appSettingsReducer,
		initialState
	)

	function setMenusIsCollapsed(data: boolean) {
		dispatch({
			type: SET_MENU_IS_COLLAPSED,
			payload: data,
		})
	}

	return (
		<AppSettingsContext.Provider
			value={{
				...state,
				setMenusIsCollapsed,
			}}
		>
			{children}
		</AppSettingsContext.Provider>
	)
}
