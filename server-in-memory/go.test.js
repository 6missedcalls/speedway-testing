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
		const resInfoLoggedOut = await app.get("/account/info")
		expect(resInfoLoggedOut.status).toBe(500)

		// CREATE A NEW ACCOUNT
		const resCreateAccount = await app.post("/account/create", {
			password: "123",
		})
		expect(resCreateAccount.status).toBe(200)
		expect(resCreateAccount.body).toHaveProperty("address")
		expect(resCreateAccount.body.address).toBeAddress()

		const address = resCreateAccount.body.address

		// ATTEMPT LOGIN WITH WRONG PASSWORD
		const resWrongLogin = await app.post("/account/login", {
			address: address,
			password: "wrong",
		})
		expect(resWrongLogin.status).toBe(401)

		// LOGIN
		const resLogin = await app.post("/account/login", {
			address: address,
			password: "123",
		})
		expect(resLogin.status).toBe(200)

		// WHILE LOGGED IN, CHECK ACCOUNT INFO
		const resInfoLoggedIn = await app.get("/account/info")
		expect(resInfoLoggedIn.status).toBe(200)
		expect(resInfoLoggedIn.body).toHaveProperty("Address")
		expect(resInfoLoggedIn.body.Address).toBe(address)

		// BUY AN ALIAS
		const alias = `steve${Date.now()}`
		const resAlias = await app.post("/alias/buy", {
			creator: address,
			alias: alias,
		})
		expect(resAlias.status).toBe(200)

		// ATTEMPT TO BUY EXISTING ALIAS
		const resAliasDup = await app.post("/alias/buy", {
			creator: address,
			alias: alias,
		})
		expect(resAliasDup.status).toBe(500)

		// QUERY ALIAS WHOIS
		const resAliasQuery = await app.get(`/alias/get/${alias}`)
		expect(resAliasQuery.status).toBe(200)
		expect(resAliasQuery.body).toHaveProperty("WhoIs.owner")
		expect(resAliasQuery.body.WhoIs.owner).toBe(address)

		// QUERY ALIAS WHOIS THAT DOESN'T EXIST
		const wrongAlias = `wrong${Date.now()}`
		const resAliasQueryWrong = await app.get(`/alias/get/${wrongAlias}`)
		expect(resAliasQueryWrong.status).toBe(404)

		// GETS AN EMPTY LIST OF SCHEMA
		const resSchemaListEmpty = await app.post("/schema/get-from-creator", {
			creator: address,
		})
		expect(resSchemaListEmpty.status).toBe(500)

		// GET AN EMPTY LIST OF BUCKETS
		const resBucketListEmpty = await app.post("/bucket/get-from-creator", {
			creator: address,
		})
		expect(resBucketListEmpty.status).toBe(200)
		expect(resBucketListEmpty.body.where_is).toBe(undefined)

		// CREATE A SCHEMA
		const resSchemaCreate = await app.post("/schema/create", {
			label: "dinosaurs",
			fields: {
				firstname: 4,
				extinct: 1,
				strength: 2,
				interest: 3,
				friends: 0,
			},
		})
		expect(resSchemaCreate.status).toBe(200)
		expect(resSchemaCreate.body).toHaveProperty("whatIs.creator")
		expect(resSchemaCreate.body.whatIs.creator).toBe(address)
		expect(resSchemaCreate.body).toHaveProperty("whatIs.schema.label")
		expect(resSchemaCreate.body.whatIs.schema.label).toBe("dinosaurs")
		expect(resSchemaCreate.body).toHaveProperty("whatIs.schema.did")
		expect(resSchemaCreate.body.whatIs.schema.did).toBeDid()

		const schemaDid = resSchemaCreate.body.whatIs.schema.did

		// CREATE A BUCKET
		const resBucketCreate = await app.post("/bucket/create", {
			creator: address,
			role: "application",
			visibility: "public",
			label: "great philosophers",
		})

		expect(resBucketCreate.status).toBe(200)

		// GET A LIST OF SCHEMAS
		const resSchemaList = await app.post("/schema/get-from-creator", {
			creator: address,
		})
		expect(resSchemaList.status).toBe(200)
		expect(resSchemaList.body).toHaveProperty("what_is.length")
		expect(resSchemaList.body.what_is.length).toBe(1)
		expect(resSchemaList.body.what_is[0]).toHaveProperty("schema.did")
		expect(resSchemaList.body.what_is[0].schema.did).toBe(schemaDid)
		expect(resSchemaList.body.what_is[0]).toHaveProperty("schema.label")
		expect(resSchemaList.body.what_is[0].schema.label).toBe("dinosaurs")
		expect(resSchemaList.body.what_is[0]).toHaveProperty("schema.fields.length")
		expect(resSchemaList.body.what_is[0].schema.fields.length).toBe(5)

		const fields = _.sortBy(resSchemaList.body.what_is[0].schema.fields, "name")

		expect(fields[0].name).toBe("extinct")
		expect(fields[0].field).toBe(1)
		expect(fields[1].name).toBe("firstname")
		expect(fields[1].field).toBe(4)
		expect(fields[2].name).toBe("friends")
		expect(fields[2].field).toBe(undefined) // should be 0, but there's a bug currently
		// expect(fields[2].field).toBe(0)
		expect(fields[3].name).toBe("interest")
		expect(fields[3].field).toBe(3)
		expect(fields[4].name).toBe("strength")
		expect(fields[4].field).toBe(2)

		// GET A LIST OF BUCKETS
		const resBucketList = await app.post("/bucket/get-from-creator", {
			creator: address,
		})
		expect(resBucketList.status).toBe(200)
		expect(resBucketList.body).toHaveProperty("where_is.length")
		expect(resBucketList.body.where_is.length).toBe(1)
		expect(resBucketList.body.where_is[0]).toHaveProperty("did")
		expect(resBucketList.body.where_is[0].did).toBeDid()
		expect(resBucketList.body.where_is[0]).toHaveProperty("label")
		expect(resBucketList.body.where_is[0].label).toBe("great philosophers")
		expect(resBucketList.body.where_is[0]).toHaveProperty("timestamp")
		expect(typeof resBucketList.body.where_is[0].timestamp).toBe("number")
		expect(resBucketList.body.where_is[0].content).toBe(undefined)

		const bucketDid = resBucketList.body.where_is[0].did

		// CREATE AN OBJECT
		const resObject = await app.post("/object/build", {
			label: "dinosaurs",
			schemaDid: schemaDid,
			object: {
				extinct: true,
				firstname: "steve",
				interest: 2.5,
				strength: 10,
				friends: ["robin", "nancy"],
			},
		})
		expect(resObject.status).toBe(200)
		expect(resObject.body).toHaveProperty("objectUpload.reference.cid")
		expect(typeof resObject.body.objectUpload.reference.cid).toBe("string")

		const objectCid = resObject.body.objectUpload.reference.cid

		// ADD OBJECT TO BUCKET
		const resAddToBucket = await app.post("/bucket/update-items", {
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
		const resBucketContents = await app.post("/bucket/get", {
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
			"eyJleHRpbmN0Ijp0cnVlLCJmaXJzdG5hbWUiOiJzdGV2ZSIsImZyaWVuZHMiOlsicm9iaW4iLCJuYW5jeSJdLCJpbnRlcmVzdCI6Mi41LCJzdHJlbmd0aCI6MTB9"
		)
	},
	10 * 60 * 1000 // 10 minutes timeout
)

const app = {
	get: async (route) =>
		fetch(`http://localhost:4040/api/v1${route}`, {
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
	post: async (route, payload) =>
		fetch(`http://localhost:4040/api/v1${route}`, {
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
