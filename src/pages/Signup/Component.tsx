import { ChangeEvent, FormEvent, useState } from "react"
import { useNavigate } from "react-router"
import AuthLayout from "../../components/AuthLayout"

type Props = {
	onSubmit: (password: string) => void
}
const Component = ({ onSubmit }: Props) => {
	const [password, setPassword] = useState("")
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
