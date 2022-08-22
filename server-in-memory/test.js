import storage from "node-persist"
import server from "./server.js"
import supertest from "supertest"
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
	expect(body).toHaveProperty("Address")
})

it("logs an account in", async () => {
	const responseAuth = await app.post("/api/v1/account/create").send({
		password: "123",
	})

	const { body: result } = await app.post("/api/v1/account/login").send({
		Address: responseAuth.body.Address,
		Password: "123",
	})
	expect(result).toHaveProperty("Address")
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
	expect(result).toHaveProperty("Address")
	expect(result.Address).toBe(responseAuth.body.Address)
})

it("creates a schema", async () => {
	const responseAuth = await app.post("/api/v1/account/create").send({
		password: "123",
	})
	const address = responseAuth.body.Address

	await app.post("/api/v1/account/login").send({
		Address: address,
		Password: "123",
	})

	const { body: result } = await app.post("/api/v1/schema/create").send({
		address,
		label: "Dinosaurs",
		fields: { name: 4 },
	})

	expect(result).toHaveProperty("whatIs")
	expect(result.whatIs).toHaveProperty("did")
	expect(result.whatIs.did).toBeDid()
	expect(result.whatIs).toHaveProperty("creator")
	expect(result.whatIs.creator).toBeDid()
	expect(result.whatIs.creator).toBe(addressToDid(address))

	expect(result).toHaveProperty("definition")
	expect(result.definition).toHaveProperty("creator")
	expect(result.definition.creator).toBe(addressToDid(address))
	expect(result.definition).toHaveProperty("label")
	expect(result.definition.label).toBe("Dinosaurs")
	expect(result.definition).toHaveProperty("fields")
	expect(result.definition.fields.length).toBe(1)
	expect(result.definition.fields[0]).toEqual({
		name: "name",
		field: 4,
	})
})

it("gets an individual schema", async () => {
	const responseAuth = await app.post("/api/v1/account/create").send({
		password: "123",
	})
	const address = responseAuth.body.Address

	await app.post("/api/v1/account/login").send({
		Address: address,
		Password: "123",
	})

	const responseSchema = await app.post("/api/v1/schema/create").send({
		address,
		label: "Dinosaurs",
		fields: { name: 4 },
	})

	const { body: result } = await app.post("/api/v1/schema/get").send({
		address,
		creator: addressToDid(address),
		schema: responseSchema.body.whatIs.did,
	})

	expect(result).toHaveProperty("creator")
	expect(result.creator).toBe(addressToDid(address))
	expect(result).toHaveProperty("label")
	expect(result.label).toBe("Dinosaurs")
	expect(result).toHaveProperty("fields")
	expect(result.fields.length).toBe(1)
	expect(result.fields[0]).toEqual({
		name: "name",
		field: 4,
	})
})

it("fetches a list of schemas", async () => {
	const { body: resultEmpty } = await app.get("/proxy/schemas")
	expect(resultEmpty).toHaveProperty("pagination")
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
		address,
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
	const responseAuth = await app.post("/api/v1/account/create").send({
		password: "123",
	})
	const address = responseAuth.body.Address

	await app.post("/api/v1/account/login").send({
		Address: address,
		Password: "123",
	})

	const responseSchema = await app.post("/api/v1/schema/create").send({
		address,
		label: "Dinosaurs",
		fields: { firstName: 4 },
	})

	const { body: result } = await app.post("/api/v1/object/build").send({
		SchemaDid: responseSchema.body.whatIs.did,
		Label: "Sonrsaur",
		Object: {
			firstName: "Rex",
		},
	})

	expect(result).toHaveProperty("reference")
	expect(result.reference.Did).toBeDid()
	expect(result.reference.Label).toBe("Sonrsaur")
	expect(typeof result.reference.Cid).toBe("string")
})

it("when building object, checks schema properties", async () => {
	const responseAuth = await app.post("/api/v1/account/create").send({
		password: "123",
	})
	const address = responseAuth.body.Address

	await app.post("/api/v1/account/login").send({
		Address: address,
		Password: "123",
	})

	const responseSchema = await app.post("/api/v1/schema/create").send({
		address,
		label: "Dinosaurs",
		fields: { firstName: 4 },
	})

	const result = await app.post("/api/v1/object/build").send({
		SchemaDid: responseSchema.body.whatIs.did,
		Label: "Sonrsaur",
		Object: {
			lastName: "Smith",
		},
	})

	expect(result.status).toBe(500)
	expect(result.body.error).toBe("Object Upload Failed")
})
