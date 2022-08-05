import { useLocation, useNavigate } from "react-router-dom"
import SideMenuComponent from "./Component"

function SideMenuContainer(){
    const navigate = useNavigate()
    const location = useLocation();
    const currentPath = location.pathname

    return (
        <SideMenuComponent 
            navigate={navigate}
            currentPath={currentPath}
        />
    )
}

export default SideMenuContainer