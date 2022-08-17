import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
	selectIsLogged,
	selectLoginError,
	userLogin,
} from "../../redux/slices/authenticationSlice"
import { AppDispatch } from "../../redux/store"
import LoginComponent from "./Component"

const Container = () => {
	const dispatch = useDispatch<AppDispatch>()
	const navigate = useNavigate()
	const isLogged = useSelector(selectIsLogged)
	const error = useSelector(selectLoginError)

	useEffect(() => {
		if (isLogged) {
			navigate("/schema")
		}
	}, [isLogged, navigate])

	function login(walletAddress: string, password: string) {
		if (!walletAddress || !password) {
			console.error("Wallet address and password are required.")
			return
		}
		dispatch(userLogin({ walletAddress, password }))
	}

	return <LoginComponent onSubmit={login} error={error} />
}

export default Container
