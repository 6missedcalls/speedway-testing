import { BASE_API } from "../utils/constants"
import { formatApiError } from "../utils/errors"

type Props = {
	bucketDid: string
	objectCid: string
}
export const updateBucketService = async ({ bucketDid, objectCid }: Props) => {
	const url = `${BASE_API}/bucket/update-items`

	const payload = JSON.stringify({
		did: bucketDid,
		content: {
			uri: objectCid,
		},
	})

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
