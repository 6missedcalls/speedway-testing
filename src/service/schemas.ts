import { BASE_API } from "../utils/constants"
import { formatApiError } from "../utils/errors"
import { Ischema } from "../utils/types"

export const getAllSchemas = async () => {
	const url = `${BASE_API}/schema/getAll`

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

export const createSchema = async (schema: Ischema) => {
	const url = `${BASE_API}/account/login`

	const payload = JSON.stringify({ schema })

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
