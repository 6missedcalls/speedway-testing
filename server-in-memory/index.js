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
const generateCid = () => md5(Math.random())

const mountAccountStoreKey = (did) => `account${did}`
const mountSchemasStoreKey = (did) => `schemas${did}`

app.get("/dump", async (_, res) => {
	const data = await storage.values()
	res.json({ data })
})

app.get("/reset", async (_, res) => {
	await storage.clear()
	const length = await storage.length()
	res.json({ length })
})

app.use((_, res, next) => {
	if (!sessionDid) {
		res.status(500).json({ message: "Not logged in" })
		return
	}
	next()
})

/// AUTHENTICATION

let sessionDid = null

app.post("/api/v1/account/create", async ({ body }, res) => {
	const did = generateDid()
	const password = body.password || ""

	const accountStoreKey = mountAccountStoreKey(did)
	await storage.setItem(accountStoreKey, {
		did,
		password,
	})

	const schemasStoreKey = mountSchemasStoreKey(did)
	await storage.setItem(schemasStoreKey, {
		schemas: [],
		schemasMetaData: {
			whatIs: [],
		},
	})

	res.json({ Address: did })
})

app.post("/api/v1/account/login", async ({ body }, res) => {
	const accountStoreKey = mountAccountStoreKey(body.Address)
	const account = await storage.getItem(accountStoreKey)

	if (!account || account.password !== body.Password) {
		res.status(500).send()
		return
	}

	sessionDid = account.did
	res.json({ Address: account.did })
})

/// SCHEMAS

app.post("/api/v1/schema/create", async ({ body }, res) => {
	if (body.address !== sessionDid) {
		res.status(200).send()
		return
	}
	const schemasStoreKey = mountSchemasStoreKey(sessionDid)
	const session = await storage.getItem(schemasStoreKey)

	const did = generateDid2()
	const creator = generateDid2()
	const fieldNames = _.keys(body.fields)

	const schemaMetaData = {
		did,
		schema: {
			did,
			label: body.label,
			cid: generateCid(),
		},
		creator: creator,
		timestamp: +new Date(),
		is_active: true,
	}

	const schema = {
		creator: creator,
		label: body.label,
		fields: _.map(fieldNames, (name) => ({ name, field: body.fields[name] })),
	}

	session.schemasMetaData.whatIs.push(schemaMetaData)
	session.schemas.push(schema)

	await storage.setItem(schemasStoreKey, session)

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

	const schemasStoreKey = mountSchemasStoreKey(sessionDid)
	const session = await storage.getItem(schemasStoreKey)
	console.log("session", JSON.stringify(session, null, 2))
	const schema = session.schemas.find((item) => item.creator === body.creator)

	if (!schema || body.creator !== schema.creator) {
		res.status(500).send()
		return
	}

	res.json(schema)
})

app.get("/api/v1/schema/getAll", async (_, res) => {
	const schemasStoreKey = mountSchemasStoreKey(sessionDid)
	const session = await storage.getItem(schemasStoreKey)

	res.json(session.schemasMetaData)
})

/// SERVER

await storage.init()
const port = 8080
app.listen(port, () => {
	console.log(`server-in-memory listening on port ${port}`)
})
