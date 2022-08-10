import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import {
	selectIsLogged,
	setIsLogged,
} from "../../redux/slices/authenticationSlice"
import LoginComponent from "./Component"

function LoginContainer() {
	const navigate = useNavigate()
	const isLogged = useSelector(selectIsLogged)
	const dispatch = useDispatch()

	function login() {
		dispatch(setIsLogged(true))
	}

	function logout() {
		dispatch(setIsLogged(false))
	}

	function goToDashboard() {
		navigate("/dashboard")
	}

	return (
		<LoginComponent
			login={login}
			logout={logout}
			goToDashboard={goToDashboard}
			isLogged={isLogged}
		/>
	)
}

export default LoginContainer
