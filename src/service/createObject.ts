import { BASE_API } from "../utils/constants"
import { formatApiError } from "../utils/errors"

type CreateObjectPayload = {
	schemaDid: string
	objectData: { [key: string]: any }
}
type CreateObjectResponse = { cid: string }

const createObject = async ({
	schemaDid,
	objectData,
}: CreateObjectPayload): Promise<CreateObjectResponse> => {
	const url = `${BASE_API}/object/build`
	const options = {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			label: "",
			schemaDid: schemaDid,
			object: objectData,
		}),
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

export default createObject
