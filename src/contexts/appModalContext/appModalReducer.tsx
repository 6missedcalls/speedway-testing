import {
	CLOSE_MODAL,
	OPEN_MODAL,
	SET_MODAL_CONTENT,
} from "../../utils/constants"
import { IappModalContextState } from "./appModalContext"

interface AppModalReducerAction {
	type: string
	payload: Record<string, any>
}

function AppModalReducer(
	state: IappModalContextState,
	{ type, payload }: AppModalReducerAction
) {
	switch (type) {
		case SET_MODAL_CONTENT: {
			return {
				...state,
				content: payload.content,
				props: payload?.props,
			}
		}
		case OPEN_MODAL: {
			return {
				...state,
				modalIsOpen: true,
			}
		}
		case CLOSE_MODAL: {
			return {
				...state,
				modalIsOpen: false,
			}
		}
	}
}

export default AppModalReducer
