import { useSelector } from "react-redux"
import { Navigate } from "react-router"
import { selectAlias, selectIsLogged } from "../../redux/slices/authenticationSlice"

interface PrivateRouteProps {
	Component: React.FC
}

function PrivateRoute({ Component, ...props }: PrivateRouteProps) {
	const isLogged = useSelector(selectIsLogged)
	const alias = useSelector(selectAlias)
	
	return <>{isLogged && alias ? <Component {...props} /> : <Navigate to="/" />}</>
}

export default PrivateRoute
