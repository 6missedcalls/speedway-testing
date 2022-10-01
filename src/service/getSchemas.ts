import { BASE_API } from "../utils/constants"
import { formatApiError } from "../utils/errors"
import { SchemaMeta } from "../utils/types"

const getSchemas = async (address: string): Promise<SchemaMeta[]> => {
	const url = `${BASE_API}/api/v1/schema/get-from-creator`
	const options = {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ creator: address }),
	}

	try {
		const response = await fetch(url, options)
		if (!response.ok) throw new Error(response.statusText)
		const data = await response.json()
		return data.what_is.map((schema: any) => ({
			did: schema.schema.did,
			label: schema.schema.label,
			fields: schema.schema.fields.map((field: any) => ({
				name: field.name,
				type: field.field,
			})),
		}))
	} catch (error) {
		const errorMessage = formatApiError({ error, url, options })
		throw new Error(errorMessage)
	}
}

export default getSchemas
