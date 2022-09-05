import { BASE_API } from "../utils/constants";
import { formatApiError } from "../utils/errors";

type LoginPayload = { address: string; password: string }
type LoginResponse = { address: string }

const login = async (payload: LoginPayload): Promise<LoginResponse> => {
	const url = `${BASE_API}/account/login`
	const options = {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(payload),
	}

	try {
		const response: Response = await fetch(url, options)
		if (!response.ok) throw new Error(response.statusText)
		const data = await response.json()
		return data
	} catch (error) {
		const errorMessage = formatApiError({ error, url, options })
		throw new Error(errorMessage)
	}
}

export default login
