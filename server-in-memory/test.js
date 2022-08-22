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
	const { body } = await app.post("/api/v1/account/create")
	expect(body.Address).toBeAddress()
})

it("logs an account in", async () => {
	const responseAuth = await app.post("/api/v1/account/create").send({
		password: "123",
	})

	const { body: result } = await app.post("/api/v1/account/login").send({
		Address: responseAuth.body.Address,
		Password: "123",
	})
	expect(result.Address).toBeAddress()
})

it("checks for logged in account", async () => {
	const responseAuthFalse = await app.get("/api/v1/account/info")
	expect(responseAuthFalse.status).toBe(500)

	const responseAuth = await app.post("/api/v1/account/create").send({
		password: "123",
	})
	await app.post("/api/v1/account/login").send({
		Address: responseAuth.body.Address,
		Password: "123",
	})

	const { body: result } = await app.get("/api/v1/account/info")
	expect(result.Address).toBe(responseAuth.body.Address)
})

it("creates a schema", async () => {
	const address = await accountLoggedIn(app)

	const { body: result } = await app.post("/api/v1/schema/create").send({
		label: "Dinosaurs",
		fields: { name: 4 },
	})

	expect(result).toHaveProperty("whatIs")
	expect(result.whatIs.did).toBeDid()
	expect(result.whatIs.creator).toBeDid()
	expect(result.whatIs.creator).toBe(addressToDid(address))

	expect(result).toHaveProperty("definition")
	expect(result.definition.creator).toBe(addressToDid(address))
	expect(result.definition.label).toBe("Dinosaurs")
	expect(result.definition.fields.length).toBe(1)
	expect(result.definition.fields[0]).toEqual({
		name: "name",
		field: 4,
	})
})

it("gets an individual schema", async () => {
	const address = await accountLoggedIn(app)

	const responseSchema = await app.post("/api/v1/schema/create").send({
		label: "Dinosaurs",
		fields: { name: 4 },
	})

	const { body: result } = await app.post("/api/v1/schema/get").send({
		creator: addressToDid(address),
		schema: responseSchema.body.whatIs.did,
	})

	expect(result.creator).toBe(addressToDid(address))
	expect(result.label).toBe("Dinosaurs")
	expect(result.fields.length).toBe(1)
	expect(result.fields[0]).toEqual({
		name: "name",
		field: 4,
	})
})

it("fetches a list of schemas", async () => {
	const { body: resultEmpty } = await app.get("/proxy/schemas")
	expect(resultEmpty).toHaveProperty("what_is")
	expect(resultEmpty.what_is.length).toBe(0)

	const responseAuth = await app.post("/api/v1/account/create").send({
		password: "123",
	})
	const address = responseAuth.body.Address
	await app.post("/api/v1/account/login").send({
		Address: address,
		Password: "123",
	})

	const responseSchema = await app.post("/api/v1/schema/create").send({
		label: "Dinosaurs",
		fields: { name: 4 },
	})
	const { body: result } = await app.get("/proxy/schemas")
	expect(result.what_is.length).toBe(1)
	expect(result.what_is[0].creator).toBe(addressToDid(address))
	expect(result.what_is[0].did).toBe(responseSchema.body.whatIs.did)
	expect(result.what_is[0].schema.did).toBe(responseSchema.body.whatIs.did)
	expect(result.what_is[0].schema.label).toBe("Dinosaurs")
	expect(result.what_is[0].schema.cid).toBe(
		responseSchema.body.whatIs.schema.cid
	)
})

it("builds an object", async () => {
	await accountLoggedIn(app)

	const responseSchema = await app.post("/api/v1/schema/create").send({
		label: "Dinosaurs",
		fields: { firstName: 4 },
	})

	const { body: result } = await app.post("/api/v1/object/build").send({
		SchemaDid: responseSchema.body.whatIs.did,
		Label: "Sonrsaur",
		Object: { firstName: "Rex" },
	})

	expect(result).toHaveProperty("reference")
	expect(result.reference.Label).toBe("Sonrsaur")
	expect(typeof result.reference.Cid).toBe("string")
})

it("when building object, checks schema properties", async () => {
	await accountLoggedIn(app)

	const responseSchema = await app.post("/api/v1/schema/create").send({
		label: "Dinosaurs",
		fields: { firstName: 4 },
	})

	const result = await app.post("/api/v1/object/build").send({
		SchemaDid: responseSchema.body.whatIs.did,
		Label: "Sonrsaur",
		Object: { lastName: "Smith" },
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
		SchemaDid: responseSchema.body.whatIs.did,
		Label: "Sonrsaur",
		Object: { firstName: "Rex" },
	})

	const { body: result } = await app.post("/api/v1/object/get").send({
		SchemaDid: responseSchema.body.whatIs.did,
		ObjectCid: responseObject.body.reference.Cid,
	})

	expect(result.firstName).toBe("Rex")
})

it("creates a bucket", async () => {
	await accountLoggedIn(app)

	const { body: result } = await app.post("/api/v1/bucket/create").send({
		label: "Lunar base",
	})

	expect(result.did).toBeDid()
})

it("gets an individual bucket", async () => {
	await accountLoggedIn(app)

	const responseBucket = await app.post("/api/v1/bucket/create").send({
		label: "Mars colony",
	})

	const { body: result } = await app.post("/api/v1/bucket/get").send({
		bucket: responseBucket.body.did,
	})
	expect(result.did).toBe(responseBucket.body.did)
	expect(result.label).toBe("Mars colony")
	expect(result.objects.length).toBe(0)
})

it("can add objects to buckets", async () => {
	await accountLoggedIn(app)

	const responseSchema = await app.post("/api/v1/schema/create").send({
		label: "Dinosaurs",
		fields: { firstName: 4 },
	})

	const responseBucket = await app.post("/api/v1/bucket/create").send({
		label: "Mars colony",
	})
	const bucketDid = responseBucket.body.did

	const responseObject = await app.post("/api/v1/object/build").send({
		SchemaDid: responseSchema.body.whatIs.did,
		Label: "Sonrsaur",
		Object: { firstName: "Rex" },
	})
	const objectCid = responseObject.body.reference.Cid

	await app.post("/api/v1/bucket/update").send({
		bucket: bucketDid,
		objects: [objectCid],
	})

	const { body: result } = await app.post("/api/v1/bucket/get").send({
		bucket: bucketDid,
	})
	expect(result.objects.length).toBe(1)
	expect(result.objects[0]).toBe(objectCid)
})

it("gets a bucket content", async () => {
	await accountLoggedIn(app)

	const responseSchema = await app.post("/api/v1/schema/create").send({
		label: "Dinosaurs",
		fields: { firstName: 4 },
	})

	const responseBucket = await app.post("/api/v1/bucket/create").send({
		label: "Mars colony",
	})
	const bucketDid = responseBucket.body.did

	const responseObject = await app.post("/api/v1/object/build").send({
		SchemaDid: responseSchema.body.whatIs.did,
		Label: "Sonrsaur",
		Object: { firstName: "Marcel" },
	})
	const objectCid = responseObject.body.reference.Cid

	await app.post("/api/v1/object/build").send({
		SchemaDid: responseSchema.body.whatIs.did,
		Label: "Not on bucket",
		Object: { firstName: "Jane" },
	})

	await app.post("/api/v1/bucket/update").send({
		bucket: bucketDid,
		objects: [objectCid],
	})

	const { body: result } = await app.post("/api/v1/bucket/content").send({
		bucket: bucketDid,
	})
	expect(result.length).toBe(1)
	expect(result[0].firstName).toBe("Marcel")
})
