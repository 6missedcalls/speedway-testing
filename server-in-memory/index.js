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

app.get("/dump", async (req, res) => {
	const data = await storage.values()
	res.json({ data })
})

app.get("/reset", async (req, res) => {
	await storage.clear()
	const length = await storage.length()
	res.json({ length })
})

/// AUTHENTICATION

let sessionDid = null

app.post("/api/v1/account/create", async (req, res) => {
	const did = md5(Math.random())
	const password = req.body.password || ""

	await storage.setItem(did, {
		did,
		password,
		schemas: [],
		buckets: [],
		objects: [],
	})

	res.json({ Did: did })
})

app.post("/api/v1/account/login", async (req, res) => {
	const account = await storage.getItem(req.body.did)

	if (!account || account.password !== req.body.password) {
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

/// BUCKETS

app.get("/api/v1/bucket", async (req, res) => {
	const session = await storage.getItem(sessionDid)
	res.json(session.buckets)
})

app.get("/api/v1/bucket/get/:cid", async (req, res) => {
	const session = await storage.getItem(sessionDid)
	const bucket = _.find(session.buckets, { cid: req.params.cid })

	if (!bucket) {
		res.status(400).send()
		return
	}

	res.json(bucket)
})

app.post("/api/v1/bucket/create", async (req, res) => {
	const session = await storage.getItem(sessionDid)

	const cid = md5(Math.random())
	session.buckets.push({ cid })
	await storage.setItem(sessionDid, session)

	res.json({ Cid: cid })
})

app.put("/api/v1/bucket", async (req, res) => {
	res.status(500).send()
})

/// SCHEMAS

app.get("/api/v1/schema", async (req, res) => {
	const session = await storage.getItem(sessionDid)
	res.json(session.schemas)
})

app.get("/api/v1/schema/:accountdid/:did", async (req, res) => {
	if (req.params.accountdid !== sessionDid) {
		res.status(400).send()
		return
	}

	const session = await storage.getItem(sessionDid)
	const schema = _.find(session.schemas, { did: req.params.did })

	if (!schema) {
		res.status(400).send()
		return
	}

	res.json(schema)
})

app.post("/api/v1/schema/create", async (req, res) => {
	const session = await storage.getItem(sessionDid)

	const did = md5(Math.random())
	session.schemas.push({ did })
	await storage.setItem(sessionDid, session)

	res.json({ Did: did })
})

/// OBJECTS

app.get("/api/v1/object", async (req, res) => {
	const session = await storage.getItem(sessionDid)
	res.json(session.objects)
})

app.get("/api/v1/object/get/:cid", async (req, res) => {
	const session = await storage.getItem(sessionDid)
	const object = _.find(session.objects, { cid: req.params.cid })

	if (!object) {
		res.status(400).send()
		return
	}

	res.json(object)
})

app.post("/api/v1/object/create", async (req, res) => {
	const session = await storage.getItem(sessionDid)

	const cid = md5(Math.random())
	session.objects.push({ cid })
	await storage.setItem(sessionDid, session)

	res.json({ Cid: cid })
})

/// SERVER

await storage.init()
const port = 8080
app.listen(port, () => {
	console.log(`server-in-memory listening on port ${port}`)
})
