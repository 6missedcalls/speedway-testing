import { BASE_API } from "../utils/constants"
import { formatApiError } from "../utils/errors"

type CreateAccountResponse = {
	address: string
}
export const createAccount = async (
	password: string
): Promise<CreateAccountResponse> => {
	const url = `${BASE_API}/account/create`

	const payload = JSON.stringify({ password })

	const options = {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: payload,
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

type LoginResponse = {
	address: string
}

export const login = async (
	walletAddress: string,
	password: string
): Promise<LoginResponse> => {
	const url = `${BASE_API}/account/login`

	const payload = JSON.stringify({ Address: walletAddress, Password: password })

	const options = {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: payload,
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

type AccountInfoResponse = {
	Address: string
}
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
