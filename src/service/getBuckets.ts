import { BASE_API } from "../utils/constants"
import { formatApiError } from "../utils/errors"
import { Bucket } from "../utils/types"

const getBuckets = async (address: string): Promise<Bucket[]> => {
	const url = `${BASE_API}/api/v1/bucket/get-from-creator`
	const options = {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ creator: address }),
	}

	try {
		const response = await fetch(url, options)
		if (!response.ok) throw new Error(response.statusText)
		const data = await response.json()

		if (!data.where_is) return []

		return data.where_is.map((bucket: any) => ({
			did: bucket.did,
			label: bucket.label,
			creator: bucket.creator,
			timestamp: bucket.timestamp,
			content: bucket.content ? bucket.content.filter((c: any) => c.uri) : [],
		}))
	} catch (error) {
		const errorMessage = formatApiError({ error, url, options })
		throw new Error(errorMessage)
	}
}

export default getBuckets
