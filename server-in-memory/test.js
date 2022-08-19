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
	expect(body).toHaveProperty("Address")
	expect(body.Address).toBeAddress()
})

it("logs an account in", async () => {
	const response = await app.post("/api/v1/account/create").send({
		password: "123",
	})

	const { body: result } = await app.post("/api/v1/account/login").send({
		Address: response.body.Address,
		Password: "123",
	})
	expect(result).toHaveProperty("Address")
	expect(result.Address).toBeAddress()
})

it("creates a schema", async () => {
	const response = await app.post("/api/v1/account/create").send({
		password: "123",
	})
	const address = response.body.Address

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
	const response1 = await app.post("/api/v1/account/create").send({
		password: "123",
	})
	const address = response1.body.Address

	await app.post("/api/v1/account/login").send({
		Address: address,
		Password: "123",
	})

	const response2 = await app.post("/api/v1/schema/create").send({
		address,
		label: "Dinosaurs",
		fields: { name: 4 },
	})

	const { body: result } = await app.post("/api/v1/schema/get").send({
		address,
		creator: addressToDid(address),
		schema: response2.body.whatIs.did,
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
