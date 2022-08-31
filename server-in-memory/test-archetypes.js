export const accountLoggedIn = async (app) => {
	const {
		body: { address },
	} = await app.post("/api/v1/account/create").send({
		password: "123",
	})

	await app.post("/api/v1/account/login").send({
		Address: address,
		Password: "123",
	})

	return address
}
