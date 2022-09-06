import { BASE_API } from "../utils/constants"
import { ObjectData } from "../utils/types"
import getObjectsFromBucket from "./getObjectsFromBucket"

type AddObjectToBucketPayload = {
	bucketDid: string
	schemaDid: string
	objectCid: string
}

const addObjectToBucket = async ({
	bucketDid,
	objectCid,
	schemaDid,
}: AddObjectToBucketPayload) => {
	try {
		const { objects } = await getObjectsFromBucket({ did: bucketDid })

		const payload = JSON.stringify({
			bucketDid: bucketDid,
			content: objects
				.map((item: ObjectData) => ({
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
