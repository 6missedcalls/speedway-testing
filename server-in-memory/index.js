import express from 'express'
import bodyParser from 'body-parser'
import _ from 'lodash'
import md5 from 'md5'
const app = express()
app.use(bodyParser.json())

const db = {}
let sessionDid = null

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

app.get('/api/v1/bucket', (req, res) => {
  res.json(req.session.buckets)
})

app.post('/api/v1/bucket', (req, res) => {
  const did = md5(Math.random())
  req.session.buckets.push({did})
  res.json({Did: did})
})

app.put('/api/v1/bucket', (req, res) => {
  res.status(500).send()
})

app.get('/api/v1/schema', (req, res) => {
  res.json(req.session.schemas)
})

app.post('/api/v1/schema', (req, res) => {
  const did = md5(Math.random())
  req.session.schemas.push({did})
  res.json({Did: did})
})

app.get('/api/v1/object', (req, res) => {
  res.json(req.session.objects)
})

app.post('/api/v1/object', (req, res) => {
  const did = md5(Math.random())
  req.session.objects.push({did})
  res.json({Did: did})
})


const port = 8080
app.listen(port, () => {
  console.log(`server-in-memory listening on port ${port}`)
})
