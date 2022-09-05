import { BASE_API } from "../utils/constants";
import { formatApiError } from "../utils/errors";

type SchemaFieldsPayload = Record<string, number>
type CreateSchemaPayload = { label: string; fields: SchemaFieldsPayload }
type CreateSchemaResponse = { did: string; label: string }

const createSchema = async (
	payload: CreateSchemaPayload
): Promise<CreateSchemaResponse> => {
	const url = `${BASE_API}/schema/create`
	const options = {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(payload),
	}

	try {
		const response: Response = await fetch(url, options)
		if (!response.ok) throw new Error(response.statusText)
		const data = await response.json()
		return {
			did: data.whatIs.did,
			label: data.definition.label,
		}
	} catch (error) {
		const errorMessage = formatApiError({ error, url, options })
		throw new Error(errorMessage)
	}
}

export default createSchema
