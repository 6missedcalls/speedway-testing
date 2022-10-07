import { BASE_API } from "../utils/constants"
import { formatApiError } from "../utils/errors"
import { BucketContent } from "../utils/types"

const createBucket = async (
	label: string,
	address: string,
	content: BucketContent[]
) => {
	const url = `${BASE_API}/api/v1/bucket/create`
	const options = {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			label,
			creator: address,
			role: "application",
			visibility: "public",
			...(content && { content }),
		}),
	}

	try {
		const response: Response = await fetch(url, options)
		if (!response.ok) throw new Error(response.statusText)
		await response.json()
	} catch (error) {
		const errorMessage = formatApiError({ error, url, options })
		throw new Error(errorMessage)
	}
}

export default createBucket
