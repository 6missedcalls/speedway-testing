import "isomorphic-fetch"

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
		expect(resSchemaCreate.body).toHaveProperty("definition.label")
		expect(resSchemaCreate.body.definition.label).toBe("dinosaurs")
		expect(resSchemaCreate.body).toHaveProperty("whatIs.did")
		expect(resSchemaCreate.body.whatIs.did).toBeDid()

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

		const userSchemas = resSchemaList.body.what_is.filter(
			(schema) => schema.creator === addressToDid(address)
		)
		expect(userSchemas.length).toBe(1)
		expect(userSchemas[0]).toHaveProperty("schema.did")
		expect(userSchemas[0].schema.did).toBeDid()
		expect(userSchemas[0]).toHaveProperty("schema.label")
		expect(userSchemas[0].schema.label).toBe("dinosaurs")

		// GET A LIST OF BUCKETS
		const resBucketList = await app.get(proxy("buckets"))
		expect(resBucketList.status).toBe(200)
		expect(resBucketList.body).toHaveProperty("where_is.length")
		expect(resBucketList.body.where_is.length).toBeGreaterThan(0)

		const userBuckets = resBucketList.body.where_is.filter(
			(bucket) => bucket.creator === address
		)
		expect(userBuckets.length).toBe(1)
		expect(userBuckets[0]).toHaveProperty("did")
		expect(userBuckets[0].did).toBeDid()
		expect(userBuckets[0]).toHaveProperty("label")
		expect(userBuckets[0].label).toBe("great philosophers")
		expect(userBuckets[0]).toHaveProperty("content.length")
		expect(userBuckets[0].content.length).toBe(0)
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
