import { useSelector } from "react-redux"
import { Navigate } from "react-router"
import { selectIsLogged } from "../../redux/slices/authenticationSlice"

interface PrivateRouteProps {
	Component: React.FC
}

function PrivateRoute({ Component, ...props }: PrivateRouteProps) {
	const isLogged = useSelector(selectIsLogged)

	return <>{isLogged ? <Component {...props} /> : <Navigate to="/" />}</>
}

export default PrivateRoute
