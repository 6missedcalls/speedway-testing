export const createAccount = async (password: string) => {
	const url = `${
		process.env.REACT_APP_BASE_API || "http://localhost:8080/api/v1"
	}/account/create`

	const payload = JSON.stringify({ password })

	const options = {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: payload,
	}

	const response = await fetch(url, options)

	try {
		const data = await response.json()
		return data
	} catch (err) {
		console.error(`Error calling ${url} with options:`, options)
		console.error(`Raw error:`, err)
	}
}

export const login = async (walletAddress: string, password: string) => {
	const url = `${process.env.REACT_APP_BASE_API}/account/login`

	const payload = JSON.stringify({ did: walletAddress, password })

	const options = {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: payload,
	}

	const response = await fetch(url, options)

	try {
		const data = await response.json()
		return data
	} catch (err) {
		console.error(`Error calling ${url} with options:`, options)
		console.error(`Raw error:`, err)
	}
}
