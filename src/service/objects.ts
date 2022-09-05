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
		return data.objectUpload.reference
	} catch (error) {
		const errorMessage = formatApiError({ error, url, options })
		throw new Error(errorMessage)
	}
}

export const getBucketContent = async ({ bucket }: { bucket: string }) => {
	const url = `${BASE_API}/bucket/get`

	const payload = JSON.stringify({ did: bucket })

	const options = {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: payload,
	}

	try {
		const response: Response = await fetch(url, options)
		if (!response.ok) throw new Error(response.statusText)
		const data = await response.json()
		return data.bucket
	} catch (error) {
		const errorMessage = formatApiError({ error, url, options })
		throw new Error(errorMessage)
	}
}
