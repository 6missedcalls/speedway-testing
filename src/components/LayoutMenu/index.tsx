import { FC, ReactNode, useContext } from "react"
import SideMenu from "../SideMenu"
import AppModal from "../AppModal"
import { AppSettingsContext } from "../../contexts/appSettingsContext/appSettingsContext"

type Props = { children: ReactNode }
const Component: FC<Props> = ({ children }) => {
	const { menuIsCollapsed, setMenusIsCollapsed } = useContext(AppSettingsContext)

	function toggleMenuIsCollapsed(){
		setMenusIsCollapsed(!menuIsCollapsed)
	}

	return (
		<div className="flex">
			<SideMenu toggleMenuIsCollapsed={toggleMenuIsCollapsed} />
			<div 
				className={`
					${menuIsCollapsed ? 'pl-28' : 'pl-80'}
					w-full relative
				`} 
			>
				{children}
			</div>
			<AppModal />
		</div>
	)
}

export default Component
