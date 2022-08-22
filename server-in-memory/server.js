import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import _ from "lodash"
import md5 from "md5"
import storage from "node-persist"

const generateAddress = () => `snr${md5(Math.random())}`
const generateDid = () => `did:snr:${md5(Math.random())}`
const generateCid = () => md5(Math.random())
const addressToDid = (address) => `did:snr:${address.slice(3)}`

const accountStoreKey = (address) => `account-${address}`
const schemaStoreKey = (did) => `schema-${did}`

const app = express()
app.use(cors())
app.use(bodyParser.json())

let sessionAddress = null

/*
Storage key structure:
{
	account-snr1111111: {}
	account-snr2222222: {}
	...

	schema-snr1111111: {}
	schema-snr2222222: {}
	...

	schemaMetaData: [...]
}
*/

/// DEVELOPMENT

app.get("/dump", async (_, res) => {
	const data = await storage.values()
	res.json({ data })
})

app.get("/reset", async (_, res) => {
	await storage.clear()
	const length = await storage.length()
	res.json({ length })
})

app.get("/logout", (_, res) => {
	sessionAddress = null
	res.status(200).send()
})

/// CHAIN PROXY

app.get("/proxy/schemas", async (_, res) => {
	const metadata = (await storage.getItem("schemaMetaData")) || []
	res.json({
		what_is: metadata,
		pagination: {},
	})
})

/// AUTHENTICATION

app.post("/api/v1/account/create", async ({ body }, res) => {
	const address = generateAddress()
	const password = body.password || ""

	await storage.setItem(accountStoreKey(address), {
		address,
		password,
	})

	res.json({ Address: address })
})

app.post("/api/v1/account/login", async ({ body }, res) => {
	const account = await storage.getItem(accountStoreKey(body.Address))

	if (!account || account.password !== body.Password) {
		res.status(500).send()
		return
	}

	sessionAddress = account.address
	res.json({ Address: account.address })
})

app.get("/api/v1/account/info", async (_, res) => {
	if (!sessionAddress) {
		res.status(500).send()
		return
	}

	res.json({ Address: sessionAddress })
})

app.use((_, res, next) => {
	if (!sessionAddress) {
		res.status(500).json({ message: "Not logged in" })
		return
	}
	next()
})

/// SCHEMAS

app.post("/api/v1/schema/create", async ({ body }, res) => {
	if (body.address !== sessionAddress) {
		res.status(200).send()
		return
	}

	const did = generateDid()
	const creator = addressToDid(body.address)

	const schemaMetaData = {
		did,
		schema: {
			did,
			label: body.label,
			cid: generateCid(),
		},
		creator,
	}

	const fields = _.map(_.keys(body.fields), (name) => ({
		name,
		field: body.fields[name],
	}))
	const schema = {
		label: body.label,
		creator,
		fields,
	}

	const allMetaData = (await storage.getItem("schemaMetaData")) || []
	allMetaData.push(schemaMetaData)

	await Promise.all([
		storage.setItem("schemaMetaData", allMetaData),
		storage.setItem(schemaStoreKey(did), schema),
	])

	res.json({
		definition: schema,
		whatIs: schemaMetaData,
	})
})

app.post("/api/v1/schema/get", async ({ body }, res) => {
	if (body.address !== sessionAddress) {
		res.status(200).send()
		return
	}

	const schema = await storage.getItem(schemaStoreKey(body.schema))

	if (!schema || body.creator !== schema.creator) {
		res.status(500).send()
		return
	}

	res.json(schema)
})

/// OBJECTS

app.post("/api/v1/object/build", async ({ body }, res) => {
	res.json({
		reference: {
			Label: body.Label,
			Did: generateDid(),
			Cid: generateCid(),
		},
	})
})

export default app
