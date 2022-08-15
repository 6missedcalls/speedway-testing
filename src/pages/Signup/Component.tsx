import { ChangeEvent, FormEvent, useState } from "react"
import { useNavigate } from "react-router"
import AuthLayout from "../../components/AuthLayout"
import { setIsLogged } from "../../redux/slices/authenticationSlice"

type Props = {
	onSubmit: (password: string) => void
}
const Component = ({ onSubmit }: Props) => {
	const [password, setPassword] = useState("")
	const navigate = useNavigate()
	const _onChange = (event: ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value)
	}
	const check = fetch("/api/v1/account/create", {
		method: "POST",
		body: JSON.stringify({
			password: password,
		}),
	})
	const _onSubmit = (event: FormEvent) => {
		event.preventDefault()
		onSubmit(password)

		check.then((res) => {
			if (res.status === 200) {
				dispatch(setIsLogged(true))
				navigate("/dashboard")
			} else {
				dispatch(setIsLogged(false))
				navigate("/login")
			}
		})
	}

	return (
		<AuthLayout
			sidebarContent={
				<div className="text-right text-white">
					<button onClick={() => navigate("/")}>Go to Login</button>
				</div>
			}
			content={
				<div className="min-w-[315px]">
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
				</div>
			}
		/>
	)
}

export default Component
function dispatch(arg0: { payload: boolean; type: string }) {
	throw new Error("Function not implemented.")
}
