import { BASE_API } from "../utils/constants"

interface updateBucketServiceProps {
	bucketDid: string
	objectCid: string
	objectName: string
	schemaDid: string
}

interface getBucketProps {
	bucketDid: string
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
		name: objectName,
		uri: objectCid,
	}

	try {
		const getBucketResponse = await getBucket({ bucketDid })

		const payload = JSON.stringify({
			bucketDid: bucketDid,
			content: getBucketResponse?.bucket
				? getBucketResponse.bucket
						.map((item: any) => ({
							schemaDid: item.schemaDid,
							type: "cid",
							name: item.name,
							uri: item.uri,
						}))
						.concat([newObject])
				: [newObject],
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

export const getBucket = async ({ bucketDid }: getBucketProps) => {
	const url = `${BASE_API}/bucket/get`

	const payload = JSON.stringify({
		bucketDid,
	})

	const options = {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: payload,
	}

	try {
		const response: Response = await fetch(url, options)
		if (!response.ok) throw new Error(response.statusText)
		const data = await response.json()
		return data
	} catch (error) {
		throw error
	}
}
