import { BASE_API } from "../utils/constants"
import { SonrObject, userGetObjectProps } from "../utils/types"

const getObject = async ({
	schemaDid,
	objectCid,
}: userGetObjectProps): Promise<SonrObject[]> => {
	try {
		const response = await fetch(`${BASE_API}/api/v1/object/get`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ schemaDid, objectCid }),
		})
		if (!response.ok) throw new Error(response.statusText)
		return await response.json()
	} catch (error) {
		throw error
	}
}

export default getObject
