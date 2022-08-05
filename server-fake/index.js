import express from 'express'
import bodyParser from 'body-parser'
import _ from 'lodash'
import { v4 as uuid } from 'uuid'
const app = express()
app.use(bodyParser.json())

const db = {
  accounts: [],
  buckets: [],
  schemas: [],
  objects: [],
}

app.post('/api/v1/account/create', (req, res) => {
  const did = uuid()
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
  res.status(500).send()
})

app.put('/api/v1/bucket', (req, res) => {
  res.status(500).send()
})

app.get('/api/v1/schema', (req, res) => {
  res.json(db.schemas)
})

app.post('/api/v1/schema', (req, res) => {
  res.status(500).send()
})

app.get('/api/v1/object', (req, res) => {
  res.json(db.objects)
})

app.post('/api/v1/object', (req, res) => {
  res.status(500).send()
})


const port = 8080
app.listen(port, () => {
  console.log(`server-fake listening on port ${port}`)
})
