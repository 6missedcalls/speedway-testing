import { formatApiError } from "../utils/errors"
import { Bucket } from "../utils/types"

type GetBucketsPayload = { address: string }
type GetBucketsResponse = { buckets: Bucket[] }

const getBuckets = async ({
	address,
}: GetBucketsPayload): Promise<GetBucketsResponse> => {
	const url = `http://localhost:4040/proxy/buckets?pagination.limit=50000`
	const options = {
		method: "GET",
		headers: { "content-type": "application/json" },
	}

	try {
		const response = await fetch(url, options)
		if (!response.ok) throw new Error(response.statusText)
		const data = await response.json()

		return {
			buckets: data.where_is
				.filter((bucket: Bucket) => bucket.creator === address)
				.map((bucket: Bucket) => ({
					did: bucket.did,
					label: bucket.label,
					content: bucket.content.filter((c) => c.uri),
				})),
		}
	} catch (error) {
		const errorMessage = formatApiError({ error, url, options })
		throw new Error(errorMessage)
	}
}

export default getBuckets
