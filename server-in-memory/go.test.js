import "isomorphic-fetch"
import _ from "lodash"

expect.extend({
	toBeAddress: (str) => ({ pass: str.slice(0, 3) === "snr" }),
	toBeDid: (str) => ({ pass: str.slice(0, 8) === "did:snr:" }),
})
const addressToDid = (address) => `did:snr:${address.slice(3)}`

it(
	"test go",
	async () => {
		// WHILE NOT LOGGED IN, CHECK ACCOUNT INFO
		const resInfoLoggedOut = await app.get(api("/account/info"))
		expect(resInfoLoggedOut.status).toBe(500)

		// CREATE A NEW ACCOUNT
		const resCreateAccount = await app.post(api("/account/create"), {
			password: "123",
		})
		expect(resCreateAccount.status).toBe(200)
		expect(resCreateAccount.body).toHaveProperty("address")
		expect(resCreateAccount.body.address).toBeAddress()

		const address = resCreateAccount.body.address

		// ATTEMPT LOGIN WITH WRONG PASSWORD
		const resWrongLogin = await app.post(api("/account/login"), {
			address: address,
			password: "wrong",
		})
		expect(resWrongLogin.status).toBe(401)

		// LOGIN
		const resLogin = await app.post(api("/account/login"), {
			address: address,
			password: "123",
		})
		expect(resLogin.status).toBe(200)

		// WHILE LOGGED IN, CHECK ACCOUNT INFO
		const resInfoLoggedIn = await app.get(api("/account/info"))
		expect(resInfoLoggedIn.status).toBe(200)
		expect(resInfoLoggedIn.body).toHaveProperty("Address")
		expect(resInfoLoggedIn.body.Address).toBe(address)

		// BUY AN ALIAS
		const alias = `steve${Date.now()}`
		const resAlias = await app.post(api("/alias/buy"), {
			creator: address,
			alias: alias,
		})
		expect(resAlias.status).toBe(200)

		// ATTEMPT TO BUY EXISTING ALIAS
		const resAliasDup = await app.post(api("/alias/buy"), {
			creator: address,
			alias: alias,
		})
		expect(resAliasDup.status).toBe(500)

		// QUERY ALIAS WHOIS
		const resAliasQuery = await app.get(api(`/alias/get/${alias}`))
		expect(resAliasQuery.status).toBe(200)
		expect(resAliasQuery.body).toHaveProperty("WhoIs.owner")
		expect(resAliasQuery.body.WhoIs.owner).toBe(address)

		// QUERY ALIAS WHOIS THAT DOESN'T EXIST
		const wrongAlias = `wrong${Date.now()}`
		const resAliasQueryWrong = await app.get(api(`/alias/get/${wrongAlias}`))
		expect(resAliasQueryWrong.status).toBe(404)

		// CREATE A SCHEMA
		const resSchemaCreate = await app.post(api("/schema/create"), {
			label: "dinosaurs",
			fields: {
				firstname: 4,
				extinct: 1,
				strength: 2,
				interest: 3,
			},
		})
		expect(resSchemaCreate.status).toBe(200)
		expect(resSchemaCreate.body).toHaveProperty("whatIs.creator")
		expect(resSchemaCreate.body.whatIs.creator).toBe(addressToDid(address))
		expect(resSchemaCreate.body).toHaveProperty("whatIs.schema.label")
		expect(resSchemaCreate.body.whatIs.schema.label).toBe("dinosaurs")
		expect(resSchemaCreate.body).toHaveProperty("whatIs.schema.did")
		expect(resSchemaCreate.body.whatIs.schema.did).toBeDid()

		const schemaDid = resSchemaCreate.body.whatIs.schema.did

		// CREATE A BUCKET
		const resBucketCreate = await app.post(api("/bucket/create"), {
			creator: address,
			role: "application",
			visibility: "public",
			label: "great philosophers",
		})

		expect(resBucketCreate.status).toBe(200)

		// GET A LIST OF SCHEMAS
		const resSchemaList = await app.get(proxy("schemas?pagination.limit=50000"))
		expect(resSchemaList.status).toBe(200)
		expect(resSchemaList.body).toHaveProperty("what_is.length")
		expect(resSchemaList.body.what_is.length).toBeGreaterThan(0)

		const userSchemas = _.filter(
			resSchemaList.body.what_is,
			(schema) => schema.creator === addressToDid(address)
		)
		expect(userSchemas.length).toBe(1)
		expect(userSchemas[0]).toHaveProperty("schema.did")
		expect(userSchemas[0].schema.did).toBe(schemaDid)
		expect(userSchemas[0]).toHaveProperty("schema.label")
		expect(userSchemas[0].schema.label).toBe("dinosaurs")

		// GET A LIST OF BUCKETS
		const resBucketList = await app.get(proxy("buckets"))
		expect(resBucketList.status).toBe(200)
		expect(resBucketList.body).toHaveProperty("where_is.length")
		expect(resBucketList.body.where_is.length).toBeGreaterThan(0)

		const userBuckets = _.filter(
			resBucketList.body.where_is,
			(bucket) => bucket.creator === address
		)
		expect(userBuckets.length).toBe(1)
		expect(userBuckets[0]).toHaveProperty("did")
		expect(userBuckets[0].did).toBeDid()
		expect(userBuckets[0]).toHaveProperty("label")
		expect(userBuckets[0].label).toBe("great philosophers")
		expect(userBuckets[0]).toHaveProperty("content.length")
		expect(userBuckets[0].content.length).toBe(0)

		const bucketDid = userBuckets[0].did

		// CHECK SCHEMA FIELDS
		const resFields = await app.post(api("/schema/get"), { schema: schemaDid })
		expect(resFields.status).toBe(200)
		expect(resFields.body).toHaveProperty("definition.fields.length")
		expect(resFields.body.definition.fields.length).toBe(4)
		const sortedFields = _.sortBy(resFields.body.definition.fields, "name")
		expect(sortedFields[0].name).toBe("extinct")
		expect(sortedFields[0].field).toBe(1)
		expect(sortedFields[1].name).toBe("firstname")
		expect(sortedFields[1].field).toBe(4)
		expect(sortedFields[2].name).toBe("interest")
		expect(sortedFields[2].field).toBe(3)
		expect(sortedFields[3].name).toBe("strength")
		expect(sortedFields[3].field).toBe(2)

		// CREATE AN OBJECT
		const resObject = await app.post(api("/object/build"), {
			label: "dinosaurs",
			schemaDid: schemaDid,
			object: {
				extinct: true,
				firstname: "steve",
				interest: 2.5,
				strength: 10,
			},
		})
		expect(resObject.status).toBe(200)
		expect(resObject.body).toHaveProperty("objectUpload.reference.cid")
		expect(typeof resObject.body.objectUpload.reference.cid).toBe("string")

		const objectCid = resObject.body.objectUpload.reference.cid

		// ADD OBJECT TO BUCKET
		const resAddToBucket = await app.post(api("/bucket/update-items"), {
			bucketDid: bucketDid,
			content: [
				{
					schemaDid: schemaDid,
					type: "cid",
					uri: objectCid,
				},
			],
		})
		expect(resAddToBucket.status).toBe(200)

		// GET BUCKET CONTENTS
		const resBucketContents = await app.post(api("/bucket/get"), {
			bucketDid: bucketDid,
		})
		expect(resBucketContents.status).toBe(200)
		expect(resBucketContents.body).toHaveProperty("bucket.length")
		expect(resBucketContents.body.bucket.length).toBe(1)
		expect(resBucketContents.body.bucket[0]).toHaveProperty("schemaDid")
		expect(resBucketContents.body.bucket[0].schemaDid).toBe(schemaDid)
		expect(resBucketContents.body.bucket[0]).toHaveProperty("uri")
		expect(resBucketContents.body.bucket[0].uri).toBe(objectCid)
		expect(resBucketContents.body.bucket[0]).toHaveProperty("content.item")
		expect(resBucketContents.body.bucket[0].content.item).toBe(
			"eyJleHRpbmN0Ijp0cnVlLCJmaXJzdG5hbWUiOiJzdGV2ZSIsImludGVyZXN0IjoyLjUsInN0cmVuZ3RoIjoxMH0="
		)
	},
	10 * 60 * 1000 // 10 minutes timeout
)

const api = (route) => `http://localhost:4040/api/v1${route}`
const proxy = (proxy) => `http://localhost:4040/proxy/${proxy}`

const app = {
	get: async (url) =>
		fetch(url, {
			method: "GET",
			headers: { "content-type": "application/json" },
		}).then(async (response) =>
			response.ok
				? {
						body: await response.json(),
						status: response.status,
				  }
				: { status: response.status }
		),
	post: async (url, payload) =>
		fetch(url, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(payload),
		}).then(async (response) =>
			response.ok
				? {
						body: await response.json(),
						status: response.status,
				  }
				: { status: response.status }
		),
}
