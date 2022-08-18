import React, { createContext, Reducer, useReducer } from "react"
import {
	CLOSE_MODAL,
	OPEN_MODAL,
	SET_MODAL_CONTENT,
} from "../../utils/constants"
import appModalReducer from "./appModalReducer"

interface AppModalProviderProps {
	children: React.ReactNode
}

const initialState = {
	content: null,
	modalIsOpen: false,
}

export const AppModalContext = createContext<any>(initialState)

export const AppModalProvider = ({ children }: AppModalProviderProps) => {
	const [state, dispatch] = useReducer<Reducer<any, any>>(
		appModalReducer,
		initialState
	)

	function setModalContent(data: string) {
		dispatch({
			type: SET_MODAL_CONTENT,
			payload: data,
		})
	}

	function openModal() {
		dispatch({
			type: OPEN_MODAL,
		})
	}

	function closeModal() {
		dispatch({
			type: CLOSE_MODAL,
		})
	}

	return (
		<AppModalContext.Provider
			value={{
				...state,
				setModalContent,
				closeModal,
				openModal,
			}}
		>
			{children}
		</AppModalContext.Provider>
	)
}
