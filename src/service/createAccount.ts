import { formatApiError } from "../utils/errors"

const createAccount = async (password: string): Promise<string> => {
	const url = `${process.env.REACT_APP_BASE_API}/account/create`
	
	const options = {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ password }),
	}

	try {
		const response: Response = await fetch(url, options)
		if (!response.ok) throw new Error(response.statusText)
		const data = await response.json()
		return data
	} catch (error: any) {
		const errorMessage = formatApiError({ error, url, options })
		throw new Error(errorMessage)
	}
}

export default createAccount
