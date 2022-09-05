import { BASE_API } from "../utils/constants"
import { parseJsonFromBase64String } from "../utils/object"

interface updateBucketServiceProps {
	bucketDid: string
	objectCid: string
	objectName: string
	schemaDid: string
}

export const updateBucketService = async ({
	bucketDid,
	objectCid,
	objectName,
	schemaDid,
}: updateBucketServiceProps) => {
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
		const data = await response.json()
		return data
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
	const url = `${BASE_API}/bucket/get`
	const options = {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ bucketDid: did }),
	}

	try {
		const response: Response = await fetch(url, options)
		if (!response.ok) throw new Error(response.statusText)
		const data = await response.json()
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
