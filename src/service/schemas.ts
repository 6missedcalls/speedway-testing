import { BASE_API } from "../utils/constants"
import { formatApiError } from "../utils/errors"
import { IgetSchemaFields } from "../utils/types"

export const getAllSchemas = async () => {
	const url = `http://localhost:4040/proxy/schemas?pagination.limit=50000`

	const options = {
		method: "GET",
		headers: { "content-type": "application/json" },
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

type SchemaFieldsPayload = Record<string, number>
type CreateSchemaPayload = { label: string; fields: SchemaFieldsPayload }
type CreateSchemaResponse = { did: string; label: string }
export const createSchema = async (
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

export const getSchema = async (schema: IgetSchemaFields) => {
	const url = `${BASE_API}/schema/get`

	const payload = JSON.stringify(schema)

	const options = {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: payload,
	}

	try {
		const response: Response = await fetch(url, options)
		if (!response.ok) throw new Error(response.statusText)
		const data = await response.json()
		return data.definition
	} catch (error) {
		const errorMessage = formatApiError({ error, url, options })
		throw new Error(errorMessage)
	}
}
