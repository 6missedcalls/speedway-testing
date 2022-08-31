import { BASE_API } from "../utils/constants"
import { formatApiError } from "../utils/errors"
import { InewObject } from "../utils/types"

export const createObject = async ({
	schemaDid,
	label,
	object,
}: InewObject) => {
	const url = `${BASE_API}/object/build`

	const payload = JSON.stringify({
		SchemaDid: schemaDid,
		Label: label,
		Object: object,
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

export const getBucketContent = async ({ bucket }: { bucket: string }) => {
	const url = `${BASE_API}/bucket/content-compatible`

	const payload = JSON.stringify({ bucket })

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

export const getAllBucketContent = async ({
	buckets,
}: {
	buckets: Array<string>
}) => {
	const url = `${BASE_API}/bucket/content-compatible`

	try {
		const bucketObjectsList = await Promise.all(
			buckets.map(async (did) => {
				const payload = JSON.stringify({ bucket: did })

				const options = {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: payload,
				}
				const response: Response = await fetch(url, options)
				if (!response.ok) throw new Error(response.statusText)
				const data = await response.json()
				console.log("data", data)
				return data
			})
		)

		const objects = bucketObjectsList.reduce((acc, item) => {
			return [...acc, ...item]
		}, [])

		return objects
	} catch (error) {
		throw error
	}
}
