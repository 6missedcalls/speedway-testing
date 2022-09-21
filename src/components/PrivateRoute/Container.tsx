import { useSelector } from "react-redux"
import { Navigate } from "react-router"
import { selectIsLogged } from "../../redux/slices/authenticationSlice"
import { ROUTE_LOGIN } from "../../utils/constants"

interface PrivateRouteProps {
	Component: React.FC
}

function PrivateRoute({ Component, ...props }: PrivateRouteProps) {
	const isLogged = useSelector(selectIsLogged)

	return <>{isLogged ? <Component {...props} /> : <Navigate to={ROUTE_LOGIN} />}</>
}

export default PrivateRoute
