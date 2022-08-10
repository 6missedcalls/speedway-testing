import { Button, LabelInput } from "@sonr-io/nebula-react"
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
				<LabelInput
					label={"Your Vault Password"}
					vertical={true}
					value={password}
					onChange={_onChange}
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
				skip for now
			</button>
		</div>
	)
}
