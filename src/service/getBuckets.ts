import MotorHttp from "../MotorHttp"
import { Bucket } from "../utils/types"

const getBuckets = async (address: string): Promise<Bucket[]> => {
	const response = await MotorHttp.QueryWhereIsByCreator({
		creator: address,
	})

	if (!response.whereIs) return []

	return response.whereIs.map((bucket) => ({
		did: bucket.did,
		label: bucket.label,
		creator: bucket.creator,
		timestamp: bucket.timestamp,
		content: bucket.content ? bucket.content.filter((c) => c.uri) : [],
	}))
}

export default getBuckets
