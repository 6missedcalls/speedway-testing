import app from "./server.js"
import storage from "node-persist"

await storage.init()
app.listen(8080, () => {
	console.log("server-in-memory listening on port 8080")
})
