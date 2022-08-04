import { useSelector } from "react-redux"
import { selectIsLogged } from "../../redux/slices/authenticationSlice"
import SideMenu from "../SideMenu"

interface BaseLayoutComponentProps {
    children: any
}

function BaseLayoutComponent({ children }: BaseLayoutComponentProps){
    const isLogged = useSelector(selectIsLogged)
  
    return (
        <div className="flex">
            {isLogged && <SideMenu />}
            {children}
        </div>
    )
}

export default BaseLayoutComponent