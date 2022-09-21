import { useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { AppSettingsContext } from "../../contexts/appSettingsContext/appSettingsContext"
import SideMenuComponent from "./Component"

interface SideMenuContainerProps {
	toggleMenuIsCollapsed: () => void
}

function SideMenuContainer({ toggleMenuIsCollapsed }: SideMenuContainerProps) {
	const { menuIsCollapsed } = useContext(AppSettingsContext)
	const navigate = useNavigate()
	const location = useLocation()
	const currentPath = location.pathname

	return (
		<SideMenuComponent
			navigate={navigate}
			currentPath={currentPath}
			menuIsCollapsed={menuIsCollapsed}
			toggleMenuIsCollapsed={toggleMenuIsCollapsed}
		/>
	)
}

export default SideMenuContainer
