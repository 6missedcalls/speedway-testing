import { formatApiError } from "../utils/errors"
import { Bucket } from "../utils/types"

const getBuckets = async (address: string): Promise<Bucket[]> => {
	const url = `http://localhost:4040/proxy/buckets`
	const options = {
		method: "GET",
		headers: { "content-type": "application/json" },
	}

	try {
		const response = await fetch(url, options)
		if (!response.ok) throw new Error(response.statusText)
		const data = await response.json()

		return data.where_is
			.filter((bucket: Bucket) => bucket.creator === address)
			.map((bucket: Bucket) => ({
				did: bucket.did,
				label: bucket.label,
				content: bucket.content.filter((c) => c.uri),
			}))
	} catch (error) {
		const errorMessage = formatApiError({ error, url, options })
		throw new Error(errorMessage)
	}
}

export default getBuckets
