import { parseJsonFromBase64String } from "../utils/object"
import { SonrObject } from "../utils/types"

const getObjectsFromBucket = async (did: string): Promise<SonrObject[]> => {
	try {
		const response = await fetch(`${process.env.REACT_APP_BASE_API}/bucket/get`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ bucketDid: did }),
		})
		if (!response.ok) throw new Error(response.statusText)
		const data = await response.json()

		if (data.bucket === null) return []

		return data.bucket.map((object: any) => ({
			cid: object.uri,
			schemaDid: object.schemaDid,
			data: parseJsonFromBase64String(object.content.item),
		}))
	} catch (error) {
		throw error
	}
}

export default getObjectsFromBucket
