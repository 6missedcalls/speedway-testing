import { Button } from "@sonr-io/nebula-react"
import { ChangeEvent, FormEvent, useState } from "react"
import { useDispatch } from "react-redux"
import { setIsLogged } from "../../redux/slices/authenticationSlice"

type Props = {
	navigate: (page: string) => void
	onSubmit: (password: string) => void
}
export default ({ navigate, onSubmit }: Props) => {
	const [password, setPassword] = useState("")
	const dispatch = useDispatch()
	const _onChange = (event: ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value)
	}
	const _onSubmit = (event: FormEvent) => {
		event.preventDefault()
		onSubmit(password)
	}

	return (
		<div>
			<form onSubmit={_onSubmit}>
				<label>Your Vault Password</label>
				<br />
				<input
					type="password"
					value={password}
					onChange={_onChange}
					className="border rounded"
				/>

				<Button label={"Submit"} type="submit" />
			</form>
			<br />
			<button
				onClick={() => {
					navigate("/dashboard")
					dispatch(setIsLogged(true))
				}}
			>
				skip
			</button>
		</div>
	)
}
