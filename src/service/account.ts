import { BASE_API } from "../utils/constants"
import { formatApiError } from "../utils/errors"

type CreateAccountPayload = { password: string }
type CreateAccountResponse = { address: string }
export const createAccount = async (
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

type LoginPayload = { address: string; password: string }
type LoginResponse = { address: string }
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
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

type AccountInfoResponse = { address: string }
export const getAccountInfo = async (): Promise<AccountInfoResponse> => {
	const url = `${BASE_API}/account/info`
	const options = {
		method: "GET",
		headers: { "content-type": "application/json" },
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
