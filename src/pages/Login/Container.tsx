import LoginComponent from "./Component"

function LoginContainer() {
	const login = (walletAddress: string, password: string) => {
		console.log(walletAddress, password)
	}

	return <LoginComponent onSubmit={login} />
}

export default LoginContainer
