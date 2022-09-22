import { SET_MENU_IS_COLLAPSED } from "../../utils/constants"
import { IappSettingsContextState } from "./appSettingsContext"

interface AppSettingsReducerAction {
	type: string
	payload: Record<string, any>
}

function AppSettingsReducer(
	state: IappSettingsContextState,
	{ type, payload }: AppSettingsReducerAction
) {
	switch (type) {
		case SET_MENU_IS_COLLAPSED: {
			return {
				...state,
				menuIsCollapsed: payload,
			}
		}
	}
}

export default AppSettingsReducer
