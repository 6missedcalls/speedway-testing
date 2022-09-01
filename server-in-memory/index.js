import app from "./server.js"
import storage from "node-persist"

await storage.init()
app.listen(4040, () => {
	console.log("server-in-memory listening on port 4040")
})
