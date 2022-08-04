import express from 'express';
import bodyParser from 'body-parser';
import _ from 'lodash';
const app = express()
app.use(bodyParser.json())

const db = {
  accounts: [],
  apps: [],
  buckets: [],
  schemas: [],
  objects: [],
};

app.post('/api/v1/account/create', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.json({success: false})
    return
  }

  db.accounts.push({
    username: req.body.username,
    password: req.body.password,
  })

  res.json({success: true})
})

app.post('/api/v1/account/login', (req, res) => {
  const account = _.find(db.accounts, {username: req.body.username})

  if (!account || account.password !== req.body.password) {
    res.json({success: false})
    return
  }

  res.json({success: true})
})

app.get('/api/v1/app', (req, res) => {
  res.json(db.apps)
})

app.post('/api/v1/app', (req, res) => {
  res.json({success: false})
})

app.get('/api/v1/bucket', (req, res) => {
  res.json(db.buckets)
})

app.post('/api/v1/bucket', (req, res) => {
  res.json({success: false})
})

app.put('/api/v1/bucket', (req, res) => {
  res.json({success: false})
})

app.get('/api/v1/schema', (req, res) => {
  res.json(db.schemas)
})

app.post('/api/v1/schema', (req, res) => {
  res.json({success: false})
})

app.get('/api/v1/object', (req, res) => {
  res.json(db.objects)
})

app.post('/api/v1/object', (req, res) => {
  res.json({success: false})
})


const port = 8080
app.listen(port, () => {
  console.log(`server-fake listening on port ${port}`)
})
