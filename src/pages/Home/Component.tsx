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
		<div className="flex flex-1 flex-col min-h-screen">
			<div className="flex flex-1 flex-row">
				<div className="flex-1 bg-[#1D1A27] p-16 text-right">
					<button
						onClick={() => navigate("/login")}
						className="text-white border rounded"
					>
						Go to Login
					</button>
				</div>

				<div className="flex items-center p-16">
					<div>
						<h1 className="text-3xl mb-8">Create a New Account</h1>

						<form onSubmit={_onSubmit}>
							<label className="block">Your Vault Password</label>
							<input
								type="password"
								value={password}
								onChange={_onChange}
								className="border rounded mb-4 block w-full"
							/>

							<button className="border rounded block w-full">Submit</button>
						</form>

						<button
							className="mt-8 w-full"
							onClick={() => {
								navigate("/dashboard")
								dispatch(setIsLogged(true))
							}}
						>
							Skip authentication
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
