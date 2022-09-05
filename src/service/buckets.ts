import { BASE_API } from "../utils/constants"
import { parseJsonFromBase64String } from "../utils/object"

type AddObjectToBucketPayload = {
	bucketDid: string
	schemaDid: string
	objectCid: string
}
export const addObjectToBucket = async ({
	bucketDid,
	objectCid,
	schemaDid,
}: AddObjectToBucketPayload) => {
	const url = `${BASE_API}/bucket/update-items`

	const newObject = {
		schemaDid: schemaDid,
		type: "cid",
		uri: objectCid,
	}

	try {
		const { objects } = await getBucket({ did: bucketDid })

		const payload = JSON.stringify({
			bucketDid: bucketDid,
			content: objects
				.map((item: ObjectData) => ({
					schemaDid: item.schemaDid,
					type: "cid",
					uri: item.cid,
				}))
				.concat([newObject]),
		})

		const options = {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: payload,
		}

		const response: Response = await fetch(url, options)
		if (!response.ok) throw new Error(response.statusText)
	} catch (error) {
		console.error(error)
		throw error
	}
}

export type ObjectData = {
	cid: string
	schemaDid: string
	data: { [key: string]: any }
}
type GetBucketPayload = { did: string }
type GetBucketResponse = { objects: ObjectData[] }
export const getBucket = async ({
	did,
}: GetBucketPayload): Promise<GetBucketResponse> => {
	try {
		const response: Response = await fetch(`${BASE_API}/bucket/get`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ bucketDid: did }),
		})
		if (!response.ok) throw new Error(response.statusText)
		const data = await response.json()

		if (data.bucket === null) return { objects: [] }

		return {
			objects: data.bucket.map((object: any) => ({
				cid: object.uri,
				schemaDid: object.schemaDid,
				data: parseJsonFromBase64String(object.content.item),
			})),
		}
	} catch (error) {
		throw error
	}
}
