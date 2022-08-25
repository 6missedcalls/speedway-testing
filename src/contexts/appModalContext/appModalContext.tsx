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

interface IopenModal {
	content: string
	props?: Record<string, any>
}

export interface IappModalContextState {
	content: string | null
	modalIsOpen: boolean
	props: Record<string, any>
	setModalContent: (data: IopenModal) => void
	openModal: () => void
	closeModal: () => void
}

const initialState = {
	content: null,
	modalIsOpen: false,
	setModalContent: () => {},
	openModal: () => {},
	closeModal: () => {},
	props: {},
}

export const AppModalContext =
	createContext<IappModalContextState>(initialState)

export const AppModalProvider = ({ children }: AppModalProviderProps) => {
	const [state, dispatch] = useReducer<Reducer<any, any>>(
		appModalReducer,
		initialState
	)

	function setModalContent(data: IopenModal) {
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
