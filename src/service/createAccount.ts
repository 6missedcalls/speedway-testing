import { BASE_API } from "../utils/constants"
import { formatApiError } from "../utils/errors"

type CreateAccountPayload = { password: string }
type CreateAccountResponse = { address: string }

const createAccount = async (
	payload: CreateAccountPayload
): Promise<CreateAccountResponse> => {
	const url = `${BASE_API}/account/create`
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
	} catch (error: any) {
		const errorMessage = formatApiError({ error, url, options })
		throw new Error(errorMessage)
	}
}

export default createAccount
