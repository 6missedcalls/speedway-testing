import express from 'express'
import bodyParser from 'body-parser'
import _ from 'lodash'
import md5 from 'md5'
const app = express()
app.use(bodyParser.json())

const db = {
  accounts: [],
  buckets: [],
  schemas: [],
  objects: [],
}

app.post('/api/v1/account/create', (req, res) => {
  const did = md5(Math.random())
  const password = req.body.password || ""

  db.accounts.push({did, password})

  res.json({Did: did})
})

app.post('/api/v1/account/login', (req, res) => {
  const account = _.find(db.accounts, {did: req.body.did})

  if (!account || account.password !== req.body.password) {
    res.status(500).send()
    return
  }

  res.json({Address: account.did})
})

app.get('/api/v1/bucket', (req, res) => {
  res.json(db.buckets)
})

app.post('/api/v1/bucket', (req, res) => {
  const did = uuid()

  db.buckets.push({did})

  res.json({Did: did})
})

app.put('/api/v1/bucket', (req, res) => {
  res.status(500).send()
})

app.get('/api/v1/schema', (req, res) => {
  res.json(db.schemas)
})

app.post('/api/v1/schema', (req, res) => {
  const did = uuid()

  db.schemas.push({did})

  res.json({Did: did})
})

app.get('/api/v1/object', (req, res) => {
  res.json(db.objects)
})

app.post('/api/v1/object', (req, res) => {
  const did = uuid()

  db.objects.push({did})

  res.json({Did: did})
})


const port = 8080
app.listen(port, () => {
  console.log(`server-in-memory listening on port ${port}`)
})
