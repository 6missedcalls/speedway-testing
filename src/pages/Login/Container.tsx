import { useNavigate } from "react-router"
import LoginComponent from "./Component"

function LoginContainer() {
	const navigate = useNavigate()

	const login = (walletAddress: string, password: string) => {
		console.log(walletAddress, password)
	}

	return (
		<LoginComponent
			navigate={navigate}
			onSubmit={login}
		/>
	)
}

export default LoginContainer
