export const accountLoggedIn = async (app) => {
	const {
		body: { Address },
	} = await app.post("/api/v1/account/create").send({
		password: "123",
	})

	await app.post("/api/v1/account/login").send({
		Address,
		Password: "123",
	})

	return Address
}
