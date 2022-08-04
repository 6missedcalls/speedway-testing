import express from 'express';

const app = express()
const port = 8080

app.get('/', (req, res) => {
  res.send('ok')
})

app.listen(port, () => {
  console.log(`server-fake listening on port ${port}`)
})
