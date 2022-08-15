import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import {
	selectIsLogged,
	userCreateAccount,
} from "../../redux/slices/authenticationSlice"
import Signup from "./Component"

const Container = () => {
	const navigate = useNavigate()

	const dispatch = useDispatch<any>()
	const isLogged = useSelector(selectIsLogged)

	useEffect(() => {
		if (isLogged) {
			navigate("/objects")
		}
	}, [isLogged, navigate])

	function createAccount(password: string) {
		if (!password) {
			console.error("Password is required.")
			return
		}
		dispatch(userCreateAccount({ password }))
	}

	return <Signup onSubmit={createAccount} />
}

export default Container
