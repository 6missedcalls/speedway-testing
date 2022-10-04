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
const objectStoreKey = (cid) => `object-${cid}`

const fieldTypeMap = {
	0: "LIST",
	1: "BOOL",
	2: "INT",
	3: "FLOAT",
	4: "STRING",
}

const app = express()
app.use(cors())
app.use(bodyParser.json())

/// DEVELOPMENT

app.use("*", async (req, _, next) => {
	// uncomment next line to see request log
	// console.info(`${req.method} ${req.originalUrl}`)
	// uncomment next line to simulate slower network response
	// await new Promise((r) => setTimeout(r, 1000))
	next()
})

app.get("/dump", async (_, res) => {
	const data = await storage.values()
	res.json({ data })
})

app.get("/reset", async (_, res) => {
	await storage.setItem("sessionAddress", null)
	await storage.clear()
	const length = await storage.length()
	res.json({ length })
})

app.get("/logout", async (_, res) => {
	await storage.setItem("sessionAddress", null)
	res.status(200).send()
})

/// ACCOUNT

app.post("/api/v1/account/create", async ({ body }, res) => {
	const address = generateAddress()

	const password = body.password || ""

	await storage.setItem(accountStoreKey(address), {
		address,
		password,
	})

	res.json({ address })
})

app.post("/api/v1/account/login", async ({ body }, res) => {
	const account = await storage.getItem(
		accountStoreKey(body.address.toLowerCase())
	)

	if (!account || account.password !== body.password) {
		res.status(401).send()
		return
	}

	await storage.setItem("sessionAddress", account.address)
	res.json({ address: account.address })
})

app.get("/api/v1/account/info", async (_, res) => {
	const sessionAddress = await storage.getItem("sessionAddress")
	if (!sessionAddress) {
		res.status(500).send()
		return
	}

	res.json({ Address: sessionAddress })
})

app.get("/api/v1/alias/get/:alias", async (req, res) => {
	const aliases = await storage.getItem("aliases")

	if (!_.has(aliases, req.params.alias)) {
		res.status(404).send()
		return
	}

	res.json({ WhoIs: aliases[req.params.alias] })
})

app.use(async (_, res, next) => {
	const sessionAddress = await storage.getItem("sessionAddress")
	if (!sessionAddress) {
		res.status(500).json({ message: "Not logged in" })
		return
	}
	next()
})

/// ALIAS

app.post("/api/v1/alias/buy", async (req, res) => {
	const aliases = (await storage.getItem("aliases")) || {}

	if (_.has(aliases, req.body.alias)) {
		res.status(500).send()
		return
	}

	const sessionAddress = await storage.getItem("sessionAddress")
	aliases[req.body.alias] = { owner: sessionAddress }
	await storage.setItem("aliases", aliases)

	res.status(200).send({})
})

/// SCHEMAS

app.post("/api/v1/schema/create", async ({ body }, res) => {
	const did = generateDid()
	const sessionAddress = await storage.getItem("sessionAddress")

	const schemaMetadata = {
		creator: sessionAddress,
		schema: {
			did,
			label: body.label,
			fields: _.map(_.keys(body.fields), (name) => ({
				name,
				field: body.fields[name] !== 0 ? body.fields[name] : undefined,
			})),
		},
	}

	const allMetadata = (await storage.getItem("schemaMetadata")) || []
	allMetadata.push(schemaMetadata)

	await storage.setItem("schemaMetadata", allMetadata)

	res.json({ whatIs: schemaMetadata })
})

app.post("/api/v1/schema/get-from-creator", async (req, res) => {
	const allMetadata = (await storage.getItem("schemaMetadata")) || []
	const metadata = _.filter(allMetadata, { creator: req.body.creator })

	if (metadata.length === 0) {
		res.status(500).send()
		return
	}

	res.json({ what_is: metadata })
})

/// BUCKETS

app.post("/api/v1/bucket/create", async ({ body }, res) => {
	const did = generateDid()
	const bucket = {
		did,
		label: body.label,
		creator: body.creator,
		timestamp: Date.now(),
		content: [],
	}

	const allBuckets = (await storage.getItem("buckets")) || []
	allBuckets.push(bucket)
	await storage.setItem("buckets", allBuckets)

	res.json({
		service: { serviceEndpoint: { did } },
	})
})

app.post("/api/v1/bucket/update-items", async ({ body }, res) => {
	const allBuckets = await storage.getItem("buckets")
	const bucket = _.find(allBuckets, { did: body.bucketDid })
	bucket.content = _.map(body.content, (c) => ({
		uri: c.uri,
		schema_did: c.schemaDid,
	}))
	bucket.timestamp = Date.now()
	await storage.setItem("buckets", allBuckets)
	res.json({})
})

app.post("/api/v1/bucket/get", async ({ body }, res) => {
	const allBuckets = await storage.getItem("buckets")
	const bucket = _.find(allBuckets, { did: body.bucketDid })

	if (bucket.content.length === 0) {
		res.json({ bucket: null })
		return
	}

	const objects = await Promise.all(
		_.chain(bucket.content)
			.filter("uri")
			.map("uri")
			.map(objectStoreKey)
			.map(storage.getItem)
			.valueOf()
	)

	const objectItems = _.reduce(
		objects,
		(acc, object) => {
			acc[object.cid] = btoa(JSON.stringify(_.omit(object, ["cid", "schema"])))
			return acc
		},
		{}
	)

	const contents = _.map(bucket.content, (content) => ({
		uri: content.uri,
		schemaDid: content.schema_did,
		content: {
			item: objectItems[content.uri],
		},
	}))
	res.json({ bucket: contents })
})

app.post("/api/v1/bucket/get-from-creator", async (req, res) => {
	const allBuckets = (await storage.getItem("buckets")) || []
	const buckets = _.chain(allBuckets)
		.filter({ creator: req.body.creator })
		.map((bucket) => ({
			...bucket,
			content: bucket.content.length > 0 ? bucket.content : undefined,
		}))
		.valueOf()
	res.json({ where_is: buckets.length > 0 ? buckets : undefined })
})

/// OBJECTS

app.post("/api/v1/object/build", async ({ body }, res) => {
	const allSchemaMetadata = await storage.getItem("schemaMetadata")
	const schemaMetadata = _.find(
		allSchemaMetadata,
		(meta) => (meta.schema.did = body.schemaDid)
	)

	const fieldsExpected = _.map(schemaMetadata.schema.fields, "name")
	const fieldsReceived = _.keys(body.object)
	if (_.difference(fieldsExpected, fieldsReceived).length > 0) {
		res.status(500).json({ error: "Object Upload Failed" })
		return
	}

	const objectData = _.chain(body.object)
		.keys()
		.sortBy()
		.reduce((acc, key) => {
			acc[key] = body.object[key]
			return acc
		}, {})
		.valueOf()

	const cid = generateCid()
	const object = {
		cid,
		schema: body.schemaDid,
		...objectData,
	}
	await storage.setItem(objectStoreKey(cid), object)

	res.json({
		objectUpload: {
			reference: {
				cid,
				Label: body.label,
			},
		},
	})
})

app.post("/api/v1/object/get", async ({ body }, res) => {
	const object = await storage.getItem(objectStoreKey(body.objectCid))
	res.json({ object: object })
})

export default app
