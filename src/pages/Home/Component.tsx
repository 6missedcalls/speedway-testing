import { Button, LabelInput } from "@sonr-io/nebula-react"
import React from "react"

const Home = () => {
	const createAccount = (event: React.FormEvent) => {
		console.log("ok")
		event.preventDefault()
	}

	return (
		<form onSubmit={createAccount}>
			<LabelInput label={"Your Vault Password"} vertical={true} />

			<Button label={"Submit"} type="submit" />
		</form>
	)
}

export default Home
