import storage from "node-persist"
import app from "./server.js"
import supertest from "supertest"
const request = supertest(app)

beforeAll(async () => {
	await storage.init({
		dir: ".node-persist-test",
	})
})

it("test endpoint", async () => {
	const { body } = await request.post("/api/v1/account/create")
	expect(Object.keys(body)).toEqual(["Address"])
	expect(typeof body.Address).toBe("string")
})
