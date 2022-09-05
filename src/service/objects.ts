import { BASE_API } from "../utils/constants"
import { formatApiError } from "../utils/errors"

type CreateObjectPayload = {
	schemaDid: string
	objectData: { [key: string]: any }
}
type CreateObjectResponse = {
	cid: string
}
export const createObject = async ({
	schemaDid,
	objectData,
}: CreateObjectPayload): Promise<CreateObjectResponse> => {
	const url = `${BASE_API}/object/build`

	const payload = JSON.stringify({
		label: "",
		schemaDid: schemaDid,
		object: objectData,
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
		return { cid: data.objectUpload.reference.Cid }
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
