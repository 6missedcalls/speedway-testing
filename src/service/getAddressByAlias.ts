import { BASE_API } from "../utils/constants"
import { formatApiError } from "../utils/errors"

const getAddressByAlias = async (alias: string): Promise<string> => {
	const url = `${BASE_API}/api/v1/alias/get/${alias}`
	const options = {
		method: "GET",
		headers: { "content-type": "application/json" },
	}

	try {
		const response: Response = await fetch(url, options)
		if (!response.ok) throw new Error(response.statusText)
		const data = await response.json()
		return data.WhoIs.owner
	} catch (error) {
		const errorMessage = formatApiError({ error, url, options })
		throw new Error(errorMessage)
	}
}

export default getAddressByAlias

