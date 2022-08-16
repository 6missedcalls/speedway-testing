import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { setIsLogged } from "../../redux/slices/authenticationSlice"
import LoginComponent from "./Component"

const Container = () => {
	const [error, setError] = useState(false)
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const login = (walletAddress: string, password: string) => {
		setError(false)
		fetch("http://localhost:8080/api/v1/account/login", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ Address: walletAddress, Password: password }),
		})
			.then((response) => response.json())
			.then(() => {
				dispatch(setIsLogged(true))
				navigate("/objects")
			})
			.catch(() => setError(true))
	}

	return <LoginComponent onSubmit={login} error={error} />
}

export default Container
