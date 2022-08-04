import express from 'express';

const app = express()
const port = 8080

app.post('/api/v1/account/create', (_, res) => {
  res.send('/api/v1/account/create')
})

app.post('/api/v1/account/login', (_, res) => {
  res.send('/api/v1/account/login')
})

app.get('/api/v1/app', (_, res) => {
  res.send('/api/v1/app')
})

app.post('/api/v1/app', (_, res) => {
  res.send('/api/v1/app')
})

app.get('/api/v1/bucket', (_, res) => {
  res.send('/api/v1/bucket')
})

app.post('/api/v1/bucket', (_, res) => {
  res.send('/api/v1/bucket')
})

app.put('/api/v1/bucket', (_, res) => {
  res.send('/api/v1/bucket')
})

app.get('/api/v1/schema', (_, res) => {
  res.send('/api/v1/schema')
})

app.post('/api/v1/schema', (_, res) => {
  res.send('/api/v1/schema')
})

app.get('/api/v1/object', (_, res) => {
  res.send('/api/v1/object')
})

app.post('/api/v1/object', (_, res) => {
  res.send('/api/v1/object')
})

app.listen(port, () => {
  console.log(`server-fake listening on port ${port}`)
})
