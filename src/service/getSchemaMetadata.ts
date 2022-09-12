import { addressToDid } from "../utils/did"
import { formatApiError } from "../utils/errors"
import { SchemaMeta } from "../utils/types"

const getSchemaMetadata = async (address: string): Promise<SchemaMeta[]> => {
	const url = `${process.env.REACT_APP_ORIGIN}/proxy/schemas?pagination.limit=50000`
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
			}))
	} catch (error) {
		const errorMessage = formatApiError({ error, url, options })
		throw new Error(errorMessage)
	}
}

export default getSchemaMetadata
