import { BASE_API } from "../utils/constants"
import { addressToDid } from "../utils/did"
import { formatApiError } from "../utils/errors"
import { SchemaMeta } from "../utils/types"

const mapFieldType = (type: string) => {
	return {
		LIST: 0,
		BOOL: 1,
		INT: 2,
		FLOAT: 3,
		STRING: 4,
		BYTES: 5,
		LINK: 6,
	}[type]
}

const getSchemaMetadata = async (address: string): Promise<SchemaMeta[]> => {
	const url = `${BASE_API}/proxy/schemas?pagination.limit=50000`
	const options = {
		method: "GET",
		headers: { "content-type": "application/json" },
	}

	try {
		const response = await fetch(url, options)
		if (!response.ok) throw new Error(response.statusText)
		const data = await response.json()
		return data.what_is
			.filter((schema: any) => schema.creator === addressToDid(address))
			.map((schema: any) => ({
				did: schema.schema.did,
				label: schema.schema.label,
				fields: schema.schema.fields.map((field: any) => ({
					name: field.name,
					type: mapFieldType(field.field),
				})),
			}))
	} catch (error) {
		const errorMessage = formatApiError({ error, url, options })
		throw new Error(errorMessage)
	}
}

export default getSchemaMetadata
