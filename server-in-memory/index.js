import express from 'express'
import bodyParser from 'body-parser'
import _ from 'lodash'
import md5 from 'md5'

const app = express()
app.use(bodyParser.json())


/// INTERNAL STATE

const db = {}
let sessionDid = null


/// AUTHENTICATION

app.post('/api/v1/account/create', (req, res) => {
  const did = md5(Math.random())
  const password = req.body.password || ""

  db[did] = {
    did,
    password,
    schemas: [],
    buckets: [],
    objects: [],
  }

  res.json({Did: did})
})

app.post('/api/v1/account/login', (req, res) => {
  const account = db[req.body.did]

  if (!account || account.password !== req.body.password) {
    res.status(500).send()
    return
  }

  sessionDid = account.did
  res.json({Address: account.did})
})

app.use((req, res, next) => {
  const session = db[sessionDid]
  if (!session) {
    res.status(500).send()
    return
  }

  req.session = session
  next()
})


/// BUCKETS

app.get('/api/v1/bucket', (req, res) => {
  res.json(req.session.buckets)
})

app.get('/api/v1/bucket/get/:cid', (req, res) => {
  const bucket = _.find(req.session.buckets, {cid: req.params.cid})

  if (!bucket) {
    res.status(400).send()
    return
  }

  res.json(bucket)
})

app.post('/api/v1/bucket/create', (req, res) => {
  const cid = md5(Math.random())
  req.session.buckets.push({cid})
  res.json({Cid: cid})
})

app.put('/api/v1/bucket', (req, res) => {
  res.status(500).send()
})


/// SCHEMAS

app.get('/api/v1/schema', (req, res) => {
  res.json(req.session.schemas)
})

app.post('/api/v1/schema/create', (req, res) => {
  const did = md5(Math.random())
  req.session.schemas.push({did})
  res.json({Did: did})
})


/// OBJECTS

app.get('/api/v1/object', (req, res) => {
  res.json(req.session.objects)
})

app.get('/api/v1/object/get/:cid', (req, res) => {
  const object = _.find(req.session.objects, {cid: req.params.cid})

  if (!object) {
    res.status(400).send()
    return
  }

  res.json(object)
})

app.post('/api/v1/object/create', (req, res) => {
  const cid = md5(Math.random())
  req.session.objects.push({cid})
  res.json({Cid: cid})
})


/// SERVER

const port = 8080
app.listen(port, () => {
  console.log(`server-in-memory listening on port ${port}`)
})
