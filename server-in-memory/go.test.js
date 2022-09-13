import "isomorphic-fetch"

expect.extend({
	toBeAddress: (str) => ({ pass: str.slice(0, 3) === "snr" }),
})

it(
	"test go",
	async () => {
		// WHILE NOT LOGGED IN, CHECK ACCOUNT INFO
		const resLoggedOutInfo = await app.get(
			"http://localhost:4040/api/v1/account/info"
		)
		expect(resLoggedOutInfo.status).toBe(500)

		// ATTEMPT LOGIN WITH WRONG CREDENTIALS

		// TODO pending bug fix where failed login breaks a subsequent registration

		// CREATE A NEW ACCOUNT
		const resCreateAccount = await app.post(
			"http://localhost:4040/api/v1/account/create",
			{ password: "123" }
		)
		expect(resCreateAccount.status).toBe(200)
		expect(resCreateAccount.body).toHaveProperty("address")
		expect(resCreateAccount.body.address).toBeAddress()

		const address = resCreateAccount.body.address

		// ATTEMPT LOGIN WITH WRONG PASSWORD
		const resWrongLogin = await app.post(
			"http://localhost:4040/api/v1/account/login",
			{
				address: address,
				password: "wrong",
			}
		)
		expect(resWrongLogin.status).toBe(401)
	},
	10 * 60 * 1000 // 10 minutes timeout
)

const app = {
	get: async (url) =>
		fetch(url, {
			method: "GET",
			headers: { "content-type": "application/json" },
		}).then(async (response) =>
			response.ok
				? {
						body: await response.json(),
						status: response.status,
				  }
				: { status: response.status }
		),
	post: async (url, payload) =>
		fetch(url, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(payload),
		}).then(async (response) =>
			response.ok
				? {
						body: await response.json(),
						status: response.status,
				  }
				: { status: response.status }
		),
}
