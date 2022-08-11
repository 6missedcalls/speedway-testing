import {
	ChangeEvent,
	Dispatch,
	FormEvent,
	SetStateAction,
	useState,
} from "react"
import { useNavigate } from "react-router"
import AuthLayout from "../../components/AuthLayout"

type Props = {
	onSubmit: (walletAddress: string, password: string) => void
}
const Component = ({ onSubmit }: Props) => {
	const [walletAddress, setWalletAddress] = useState("")
	const [password, setPassword] = useState("")
	const navigate = useNavigate()
	const _onChange =
		(setStateAction: Dispatch<SetStateAction<string>>) =>
		(event: ChangeEvent<HTMLInputElement>) => {
			setStateAction(event.target.value)
		}
	const _onSubmit = (event: FormEvent) => {
		event.preventDefault()
		onSubmit(walletAddress, password)
	}

	return (
		<AuthLayout
			sidebarContent={
				<div className="text-right">
					<button
						onClick={() => navigate("/signup")}
						className="text-white border rounded"
					>
						Go to Registration
					</button>
				</div>
			}
			content={
				<div className="min-w-[315px]">
					<h1 className="text-3xl mb-8">Login to Your Vault</h1>

					<form onSubmit={_onSubmit}>
						<label className="block">Wallet Address</label>
						<input
							value={walletAddress}
							onChange={_onChange(setWalletAddress)}
							className="border rounded mb-4 block w-full"
						/>

						<label className="block">Your Vault Password</label>
						<input
							type="password"
							value={password}
							onChange={_onChange(setPassword)}
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
