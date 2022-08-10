import { Button, LabelInput } from "@sonr-io/nebula-react"
import { FormEvent } from "react"
import { useDispatch } from "react-redux"
import { setIsLogged } from "../../redux/slices/authenticationSlice"

type Props = {
	navigate: (page: string) => void
	onSubmit: (event: FormEvent) => void
}
const Home = ({ navigate, onSubmit }: Props) => {
	const dispatch = useDispatch()
	return (
		<div>
			<form onSubmit={onSubmit}>
				<LabelInput label={"Your Vault Password"} vertical={true} />

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

export default Home
