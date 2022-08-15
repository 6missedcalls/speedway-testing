const BASE_API =
	process.env.REACT_APP_BASE_API || "http://localhost:8080/api/v1"

export const createAccount = async (password: string) => {
	const url = `${BASE_API}/account/create`

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
		console.error(err)
		throw new Error(
			`Error calling ${url} with options: ${JSON.stringify(options, null, 2)}`
		)
	}
}

export const login = async (walletAddress: string, password: string) => {
	const url = `${BASE_API}/account/login`

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
		console.error(err)
		throw new Error(
			`Error calling ${url} with options: ${JSON.stringify(options, null, 2)}`
		)
	}
}
