import { BASE_API } from "../utils/constants"
import { formatApiError } from "../utils/errors"
import { ObjectData } from "../utils/types"

const createObject = async (
	schemaDid: string,
	objectData: ObjectData,
	label: string
): Promise<string> => {
	const url = `${BASE_API}/object/build`
	const options = {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			label,
			schemaDid: schemaDid,
			object: objectData,
		}),
	}

	try {
		const response: Response = await fetch(url, options)
		if (!response.ok) throw new Error(response.statusText)
		const data = await response.json()
		return data.objectUpload.reference.cid
	} catch (error) {
		const errorMessage = formatApiError({ error, url, options })
		throw new Error(errorMessage)
	}
}

export default createObject
