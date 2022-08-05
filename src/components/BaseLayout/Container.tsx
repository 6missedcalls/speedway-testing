import { useSelector } from "react-redux"
import { selectIsLogged } from "../../redux/slices/authenticationSlice"
import BaseLayoutComponent from "./Component"

interface BaseLayoutContainerProps {
    children: any
}

function BaseLayoutContainer({ children }: BaseLayoutContainerProps){
    const isLogged = useSelector(selectIsLogged)
  
    return (
        <BaseLayoutComponent 
            isLogged={isLogged}
            children={children}
        />
    )
}

export default BaseLayoutContainer