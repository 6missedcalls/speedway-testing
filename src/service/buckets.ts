import { BASE_API } from "../utils/constants"
import { formatApiError } from "../utils/errors"

export const updateBucketService = async ({ bucket, objects }: any) => {
	const url = `${BASE_API}/bucket/update`

	const payload = JSON.stringify({ bucket, objects })

	const options = {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: payload
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
