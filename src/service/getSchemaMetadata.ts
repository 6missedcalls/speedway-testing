import { addressToDid } from "../utils/did"
import { formatApiError } from "../utils/errors"
import { SchemaMeta } from "../utils/types"

type GetAllSchemasPayload = { address: string }
type GetAllSchemasResponse = { schemas: SchemaMeta[] }

const getSchemaMetadata = async ({
	address,
}: GetAllSchemasPayload): Promise<GetAllSchemasResponse> => {
	const url = `http://localhost:4040/proxy/schemas?pagination.limit=50000`
	const options = {
		method: "GET",
		headers: { "content-type": "application/json" },
	}

	try {
		const response = await fetch(url, options)
		if (!response.ok) throw new Error(response.statusText)
		const data = await response.json()
		return {
			schemas: data.what_is
				.filter((schema: any) => schema.creator === addressToDid(address))
				.map((schema: any) => ({
					did: schema.schema.did,
					label: schema.schema.label,
				})),
		}
	} catch (error) {
		const errorMessage = formatApiError({ error, url, options })
		throw new Error(errorMessage)
	}
}

export default getSchemaMetadata
