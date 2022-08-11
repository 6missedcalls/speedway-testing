import { useState } from "react"
import LoginComponent from "./Component"

const Container = () => {
	const [error, setError] = useState(false)
	const login = (walletAddress: string, password: string) => {
		setError(false)
		fetch("http://localhost:8080/api/v1/account/login", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ did: walletAddress, password }),
		})
			.then((response) => response.json())
			.then((body) => alert(JSON.stringify(body)))
			.catch(() => setError(true))
	}

	return <LoginComponent onSubmit={login} error={error} />
}

export default Container
