import Home from "./Component"

export default () => {
	const createAccount = (password: string) => {
		fetch("http://localhost:8080/api/v1/account/create", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ password }),
		})
			.then((response) => response.json())
			.then((body) => alert(JSON.stringify(body)))
	}
	return <Home onSubmit={createAccount} />
}
