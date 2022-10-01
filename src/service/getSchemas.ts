import { BASE_API } from "../utils/constants"
import { SchemaMeta } from "../utils/types"

const getSchemas = async (address: string): Promise<SchemaMeta[]> => {
	const url = `${BASE_API}/api/v1/schema/get-from-creator`
	const options = {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ creator: address }),
	}

	const response = await fetch(url, options)

	if (!response.ok) return []

	const data = await response.json()
	return data.what_is.map((schema: any) => ({
		did: schema.schema.did,
		label: schema.schema.label,
		fields: schema.schema.fields.map((field: any) => ({
			name: field.name,
			type: field.field || 0,
		})),
	}))
}

export default getSchemas
