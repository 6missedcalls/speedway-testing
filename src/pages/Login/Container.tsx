import LoginComponent from "./Component"

function LoginContainer() {
	const login = (walletAddress: string, password: string) => {
		fetch("http://localhost:8080/api/v1/account/login", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ did: walletAddress, password }),
		})
			.then((response) => response.json())
			.then((body) => alert(JSON.stringify(body)))
	}

	return <LoginComponent onSubmit={login} />
}

export default LoginContainer
