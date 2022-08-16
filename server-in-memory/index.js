import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import _ from "lodash"
import md5 from "md5"
import storage from "node-persist"

const app = express()
app.use(cors())
app.use(bodyParser.json())

/// DEVELOPMENT

const generateDid = () => `snr${md5(Math.random())}`
const generateDid2 = () => `did:snr:${md5(Math.random())}`
const didToDid2 = (did) => `did:snr:${did.slice(3)}`

app.get("/dump", async (_, res) => {
	const data = await storage.values()
	res.json({ data })
})

app.get("/reset", async (_, res) => {
	await storage.clear()
	const length = await storage.length()
	res.json({ length })
})

/// AUTHENTICATION

let sessionDid = null

app.post("/api/v1/account/create", async ({ body }, res) => {
	const did = generateDid()
	const password = body.password || ""

	await storage.setItem(did, {
		did,
		password,
		schemas: {},
	})

	res.json({ Address: did })
})

app.post("/api/v1/account/login", async ({ body }, res) => {
	const account = await storage.getItem(body.Address)

	if (!account || account.password !== body.Password) {
		res.status(500).send()
		return
	}

	sessionDid = account.did
	res.json({ Address: account.did })
})

app.use((_, res, next) => {
	if (!sessionDid) {
		res.status(500).send()
		return
	}
	next()
})

/// SCHEMAS

app.post("/api/v1/schema/create", async ({ body }, res) => {
	if (body.address !== sessionDid) {
		res.status(200).send()
		return
	}

	const session = await storage.getItem(sessionDid)

	const did = generateDid2()
	const fieldNames = _.keys(body.fields)
	const schema = {
		creator: body.address,
		label: body.label,
		fields: _.map(fieldNames, (name) => ({ name, field: body.fields[name] })),
	}
	session.schemas[did] = schema
	await storage.setItem(sessionDid, session)

	res.json({
		definition: schema,
		whatIs: { did },
	})
})

app.post("/api/v1/schema/get", async ({ body }, res) => {
	if (body.address !== sessionDid) {
		res.status(200).send()
		return
	}

	const session = await storage.getItem(sessionDid)

	const schema = session.schemas[body.schema]
	if (body.creator !== didToDid2(schema.creator)) {
		res.status(500).send()
		return
	}

	res.json(schema)
})

/// SERVER

await storage.init()
const port = 8080
app.listen(port, () => {
	console.log(`server-in-memory listening on port ${port}`)
})
