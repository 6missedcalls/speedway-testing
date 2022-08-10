import { ChangeEvent, FormEvent, useState } from "react"
import { useNavigate } from "react-router"
import { useDispatch } from "react-redux"
import AuthLayout from "../../components/AuthLayout"
import { setIsLogged } from "../../redux/slices/authenticationSlice"

type Props = {
	onSubmit: (password: string) => void
}
export default ({ onSubmit }: Props) => {
	const [password, setPassword] = useState("")
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const _onChange = (event: ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value)
	}
	const _onSubmit = (event: FormEvent) => {
		event.preventDefault()
		onSubmit(password)
	}

	return (
		<AuthLayout
			sidebarContent={
				<div className="text-right">
					<button
						onClick={() => navigate("/login")}
						className="text-white border rounded"
					>
						Go to Login
					</button>
				</div>
			}
			content={
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
			}
		/>
	)
}
