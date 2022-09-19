import storage from "node-persist"
import server from "./server.js"
import supertest from "supertest"
import { accountLoggedIn } from "./test-archetypes.js"
const app = supertest(server)

expect.extend({
	toBeAddress: (str) => ({ pass: str.slice(0, 3) === "snr" }),
	toBeDid: (str) => ({ pass: str.slice(0, 8) === "did:snr:" }),
})
const addressToDid = (address) => `did:snr:${address.slice(3)}`

beforeAll(async () => {
	await storage.init({ dir: ".node-persist-test" })
})

beforeEach(async () => {
	await Promise.all([app.get("/logout"), storage.clear()])
})

it("creates an account", async () => {
	const { body } = await app.post("/api/v1/account/create").send()
	expect(body.address).toBeAddress()
})

it("logs an account in", async () => {
	const responseAuth = await app.post("/api/v1/account/create").send({
		password: "123",
	})

	const { body: result } = await app.post("/api/v1/account/login").send({
		address: responseAuth.body.address,
		password: "123",
	})
	expect(result.address).toBeAddress()
})

it("checks for logged in account", async () => {
	const responseAuthFalse = await app.get("/api/v1/account/info")
	expect(responseAuthFalse.status).toBe(500)

	const responseAuth = await app.post("/api/v1/account/create").send({
		password: "123",
	})
	await app.post("/api/v1/account/login").send({
		address: responseAuth.body.address,
		password: "123",
	})

	const { body: result } = await app.get("/api/v1/account/info")
	expect(result.Address).toBe(responseAuth.body.address)
})

it("purchase an alias", async () => {
	const address = await accountLoggedIn(app)

	const { status: result } = await app.post("/api/v1/alias/buy").send({
		alias: "tokyo",
		creator: address,
	})
	expect(result).toBe(200)
})

it("can't buy alias that is already taken", async () => {
	const address = await accountLoggedIn(app)

	await app.post("/api/v1/alias/buy").send({ alias: "tokyo" })

	const { status } = await app.post("/api/v1/alias/buy").send({
		alias: "tokyo",
		creator: address,
	})
	expect(status).toBe(500)
})

it("queries an alias whois", async () => {
	const address = await accountLoggedIn(app)

	const { status: statusNotFound } = await app.get("/proxy/alias/tokyo")
	expect(statusNotFound).toBe(404)

	await app.post("/api/v1/alias/buy").send({ alias: "tokyo" })

	const { status, body } = await app.get("/api/v1/alias/get/tokyo")
	expect(status).toBe(200)
	expect(body.WhoIs.owner).toBe(address)
})

it("creates a schema", async () => {
	await accountLoggedIn(app)

	const { body: result } = await app.post("/api/v1/schema/create").send({
		label: "Dinosaurs",
		fields: { name: 4 },
	})

	expect(result).toHaveProperty("whatIs.schema.did")
	expect(result.whatIs.schema.did).toBeDid()
	expect(result).toHaveProperty("whatIs.schema.label")
	expect(result.whatIs.schema.label).toBe("Dinosaurs")
})

// we no longer need to get individual schemas because metadata now contains the field info
it("gets an individual schema", async () => {
	const address = await accountLoggedIn(app)

	const responseSchema = await app.post("/api/v1/schema/create").send({
		label: "Dinosaurs",
		fields: { name: 4 },
	})

	const { body: result } = await app.post("/api/v1/schema/get").send({
		schema: responseSchema.body.whatIs.schema.did,
	})

	expect(result).toHaveProperty("definition")
	expect(result.definition.creator).toBe(addressToDid(address))
	expect(result.definition.label).toBe("Dinosaurs")
	expect(result.definition.fields.length).toBe(1)
	expect(result.definition.fields[0]).toEqual({
		name: "name",
		field: 4,
	})
})

it("fetches a list of schemas", async () => {
	const address = await accountLoggedIn(app)

	const { body: resultEmpty } = await app.get("/proxy/schemas")
	expect(resultEmpty).toHaveProperty("what_is")
	expect(resultEmpty.what_is.length).toBe(0)

	const responseSchema = await app.post("/api/v1/schema/create").send({
		label: "Dinosaurs",
		fields: { name: 4 },
	})

	const { body: result } = await app.get("/proxy/schemas")
	expect(result.what_is.length).toBe(1)
	expect(result.what_is[0].creator).toBe(addressToDid(address))
	expect(result.what_is[0].schema.did).toBe(responseSchema.body.whatIs.schema.did)
	expect(result.what_is[0].schema.label).toBe("Dinosaurs")
})

it("creates a bucket", async () => {
	const address = await accountLoggedIn(app)

	const { body: result } = await app.post("/api/v1/bucket/create").send({
		label: "Lunar base",
		creator: address,
	})

	expect(result).toHaveProperty("service")
	expect(result.service).toHaveProperty("serviceEndpoint")
	expect(result.service.serviceEndpoint).toHaveProperty("did")
	expect(result.service.serviceEndpoint.did).toBeDid()
})

it("fetches a list of buckets", async () => {
	const address = await accountLoggedIn(app)

	await app.post("/api/v1/bucket/create").send({
		label: "Dragons",
		content: address,
	})
	await app.post("/api/v1/bucket/create").send({
		label: "Furniture",
		content: address,
	})

	const { body: result } = await app.get("/proxy/buckets")
	expect(result).toHaveProperty("where_is")
	expect(result.where_is.length).toBe(2)
	expect(result.where_is[0].did).toBeDid()
	expect(result.where_is[0].label).toBe("Dragons")
	expect(result.where_is[0].content.length).toBe(0)
	expect(result.where_is[1].did).toBeDid()
	expect(result.where_is[1].label).toBe("Furniture")
	expect(result.where_is[1].content.length).toBe(0)
})

it("builds an object", async () => {
	await accountLoggedIn(app)

	const responseSchema = await app.post("/api/v1/schema/create").send({
		label: "Dinosaurs",
		fields: { firstName: 4 },
	})

	const { body: result } = await app.post("/api/v1/object/build").send({
		schemaDid: responseSchema.body.whatIs.schema.did,
		label: "Sonrsaur",
		object: { firstName: "Rex" },
	})

	expect(result).toHaveProperty("objectUpload")
	expect(result.objectUpload).toHaveProperty("reference")
	expect(result.objectUpload.reference.Label).toBe("Sonrsaur")
	expect(typeof result.objectUpload.reference.cid).toBe("string")
})

it("when building object, checks schema properties", async () => {
	await accountLoggedIn(app)

	const responseSchema = await app.post("/api/v1/schema/create").send({
		label: "Dinosaurs",
		fields: { firstName: 4 },
	})

	const result = await app.post("/api/v1/object/build").send({
		schemaDid: responseSchema.body.whatIs.schema.did,
		label: "Sonrsaur",
		object: { lastName: "Smith" },
	})

	expect(result.status).toBe(500)
	expect(result.body.error).toBe("Object Upload Failed")
})

it("gets an object", async () => {
	await accountLoggedIn(app)

	const responseSchema = await app.post("/api/v1/schema/create").send({
		label: "Dinosaurs",
		fields: { firstName: 4 },
	})

	const responseObject = await app.post("/api/v1/object/build").send({
		schemaDid: responseSchema.body.whatIs.schema.did,
		label: "Sonrsaur",
		object: { firstName: "Rex" },
	})

	const { body: result } = await app.post("/api/v1/object/get").send({
		schemaDid: responseSchema.body.whatIs.schema.did,
		objectCid: responseObject.body.objectUpload.reference.cid,
	})

	expect(result).toHaveProperty("object")
	expect(result.object).toHaveProperty("firstName")
	expect(result.object.firstName).toBe("Rex")
})

it("can add objects to buckets", async () => {
	const address = await accountLoggedIn(app)

	const responseSchema = await app.post("/api/v1/schema/create").send({
		label: "Dinosaurs",
		fields: { firstName: 4 },
	})
	const schemaDid = responseSchema.body.whatIs.schema.did

	const responseBucket = await app.post("/api/v1/bucket/create").send({
		label: "Mars colony",
		creator: address,
	})
	const bucketDid = responseBucket.body.service.serviceEndpoint.did

	const responseObject = await app.post("/api/v1/object/build").send({
		schemaDid: schemaDid,
		label: "Sonrsaur",
		object: { firstName: "Rex" },
	})
	const objectCid = responseObject.body.objectUpload.reference.cid

	await app.post("/api/v1/bucket/update-items").send({
		bucketDid: bucketDid,
		content: [
			{
				schemaDid,
				type: "cid",
				uri: objectCid,
			},
		],
	})

	const { body: result } = await app.get("/proxy/buckets")
	expect(result.where_is[0].did).toBe(bucketDid)
	expect(result.where_is[0].creator).toBe(address)
	expect(result.where_is[0].label).toBe("Mars colony")
	expect(result.where_is[0].content.length).toBe(1)
	expect(result.where_is[0].content[0].uri).toBe(objectCid)
	expect(result.where_is[0].content[0].schema_did).toBe(schemaDid)
})

it("gets a bucket content", async () => {
	const address = await accountLoggedIn(app)

	const responseSchema = await app.post("/api/v1/schema/create").send({
		label: "Dinosaurs",
		fields: { firstName: 4 },
	})
	const schemaDid = responseSchema.body.whatIs.schema.did

	const responseBucket = await app.post("/api/v1/bucket/create").send({
		label: "Mars colony",
		creator: address,
	})
	const bucketDid = responseBucket.body.service.serviceEndpoint.did

	const responseObject = await app.post("/api/v1/object/build").send({
		schemaDid: schemaDid,
		label: "Sonrsaur",
		object: { firstName: "Marcel" },
	})
	const objectCid = responseObject.body.objectUpload.reference.cid

	await app.post("/api/v1/object/build").send({
		schemaDid: schemaDid,
		label: "Not on bucket",
		object: { firstName: "Jane" },
	})

	await app.post("/api/v1/bucket/update-items").send({
		bucketDid: bucketDid,
		content: [
			{
				schemaDid,
				type: "cid",
				uri: objectCid,
			},
		],
	})

	const { body: result } = await app.post("/api/v1/bucket/get").send({
		bucketDid: bucketDid,
	})
	expect(result).toHaveProperty("bucket")
	expect(result.bucket.length).toBe(1)
	expect(result.bucket[0].uri).toBe(objectCid)
	expect(result.bucket[0].schemaDid).toBe(schemaDid)
	expect(result.bucket[0].content).toHaveProperty("item")
	expect(result.bucket[0].content.item).toBe("eyJmaXJzdE5hbWUiOiJNYXJjZWwifQ==")
})

it("responds with null when bucket is empty", async () => {
	const address = await accountLoggedIn(app)

	const responseBucket = await app.post("/api/v1/bucket/create").send({
		label: "Mars colony",
		creator: address,
	})
	const bucketDid = responseBucket.body.service.serviceEndpoint.did

	const { body: result } = await app.post("/api/v1/bucket/get").send({
		bucketDid: bucketDid,
	})

	expect(result.bucket).toBe(null)
})
