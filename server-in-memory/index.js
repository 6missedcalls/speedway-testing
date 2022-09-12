import app from "./server.js"
import storage from "node-persist"
import * as dotenv from 'dotenv'
dotenv.config()

await storage.init()
const port = process.env.PORT || 4040
app.listen(port, () => {
	console.log(`server-in-memory listening on port ${port}`)
})
