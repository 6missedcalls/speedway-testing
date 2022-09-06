import { BASE_API } from "../utils/constants"
import { parseJsonFromBase64String } from "../utils/object"
import { SonrObject } from "../utils/types"

type GetBucketPayload = { did: string }
type GetBucketResponse = { objects: SonrObject[] }

const getObjectsFromBucket = async ({
	did,
}: GetBucketPayload): Promise<GetBucketResponse> => {
	try {
		const response = await fetch(`${BASE_API}/bucket/get`, {
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

export default getObjectsFromBucket
