import { BASE_API } from "../utils/constants"
import { SonrObject } from "../utils/types"
import getObjectsFromBucket from "./getObjectsFromBucket"

const addObjectToBucket = async (
	bucketDid: string,
	schemaDid: string,
	objectCid: string
) => {
	try {
		const objects = await getObjectsFromBucket(bucketDid)

		const payload = JSON.stringify({
			bucketDid: bucketDid,
			content: objects
				.map((item: SonrObject) => ({
					schemaDid: item.schemaDid,
					type: "cid",
					uri: item.cid,
				}))
				.concat([
					{
						schemaDid: schemaDid,
						type: "cid",
						uri: objectCid,
					},
				]),
		})

		const response: Response = await fetch(`${BASE_API}/bucket/update-items`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: payload,
		})
		if (!response.ok) throw new Error(response.statusText)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export default addObjectToBucket
