import { BASE_API } from "../utils/constants"
import { formatApiError } from "../utils/errors"

const login = async (address: string, password: string): Promise<string> => {
	const url = `${BASE_API}/account/login`
	const options = {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ address, password }),
	}

	try {
		const response: Response = await fetch(url, options)
		if (!response.ok) throw new Error(response.statusText)
		const data = await response.json()
		return data.address
	} catch (error) {
		const errorMessage = formatApiError({ error, url, options })
		throw new Error(errorMessage)
	}
}

export default login
