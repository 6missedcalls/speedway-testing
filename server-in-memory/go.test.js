import "isomorphic-fetch"

expect.extend({
	toBeAddress: (str) => ({ pass: str.slice(0, 3) === "snr" }),
})

it(
	"test go",
	async () => {
		const body = await app.post("http://localhost:4040/api/v1/account/create", {
			password: "123",
		})
		expect(body.address).toBeAddress()
	},
	10 * 60 * 1000 // 10 minutes timeout
)

const app = {
	get: async (url) =>
		fetch(url, {
			method: "GET",
			headers: { "content-type": "application/json" },
		}).then((response) => response.json()),
	post: async (url, payload) =>
		fetch(url, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(payload),
		}).then((response) => response.json()),
}
