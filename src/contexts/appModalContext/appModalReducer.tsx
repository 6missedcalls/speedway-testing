import {
	CLOSE_MODAL,
	OPEN_MODAL,
	SET_MODAL_CONTENT,
} from "../../utils/constants"

function AppModalReducer(state: any, { type, payload }: any) {
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
