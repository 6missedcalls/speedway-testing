import { Button, LabelInput } from "@sonr-io/nebula-react"
import { FormEvent } from "react"

const Home = () => {
	const createAccount = (event: FormEvent) => {
		event.preventDefault()
		fetch("http://localhost:8080/api/v1/account/create", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ password: "abcdef" }),
		})
			.then((response) => response.json())
			.then((body) => alert(JSON.stringify(body)))
	}

	return (
		<form onSubmit={createAccount}>
			<LabelInput label={"Your Vault Password"} vertical={true} />

			<Button label={"Submit"} type="submit" />
		</form>
	)
}

export default Home
