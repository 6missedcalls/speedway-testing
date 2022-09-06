import { BASE_API } from "../utils/constants"
import { formatApiError } from "../utils/errors"
import { SchemaField } from "../utils/types"

export type GetSchemaFieldsResponse = { fields: SchemaField[] }

const getSchemaFields = async (
	did: string
): Promise<GetSchemaFieldsResponse> => {
	const url = `${BASE_API}/schema/get`
	const options = {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ schema: did }),
	}

	try {
		const response: Response = await fetch(url, options)
		if (!response.ok) throw new Error(response.statusText)
		const data = await response.json()
		return {
			fields: data.definition.fields.map(
				(field: { name: string; field: string }) => ({
					name: field.name,
					type: field.field,
				})
			),
		}
	} catch (error) {
		const errorMessage = formatApiError({ error, url, options })
		throw new Error(errorMessage)
	}
}

export default getSchemaFields
