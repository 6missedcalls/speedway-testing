import {
	ChangeEvent,
	Dispatch,
	FormEvent,
	SetStateAction,
	useState,
} from "react"
import { useNavigate } from "react-router"
import AlertSvg from "../../assets/svgs/Alert"
import LayoutAuth from "../../components/LayoutAuth"
import { ROUTE_LOGIN } from "../../utils/constants"

type Props = {
	onSubmit: (walletAddress: string, password: string) => void
	error: boolean
}
const Component = ({ onSubmit, error }: Props) => {
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
		<LayoutAuth
			route={ROUTE_LOGIN}
			sidebarContent={
				<div className=" max-w-[479px] flex flex-col mt-40 ml-14">
					<div className="text-custom-3xl font-extrabold tracking-custom-x2tighter mb-6">
						Create Your Vault
					</div>
					<div className="text-custom-md font-normal tracking-custom-tight mb-10">
						Your Vault is where your Sonr data is stored and encrypted. It's
						currently accessed with a password, but soon we'll be able to verify
						your identity using only your devices.
					</div>
					<div className="flex mb-4">
						<div className="w-5 mr-2.5 flex items-center">
							<AlertSvg />
						</div>
						<span className="block text-custom-md font-extrabold tracking-custom-tight">
							Choose a unique and memorable password.
						</span>
					</div>
					<div className="text-custom-sm tracking-custom-tight">
						Sonr does not collect personal information, and will be unable to
						recover your account if you forget.
					</div>
				</div>
			}
			content={
				<div className="flex justify-center items-center flex-col">
					<h1 className="text-3xl mb-8">Login to Your Vault</h1>

					<form onSubmit={_onSubmit}>
						<div className="mb-4">
							<label className="block">Wallet Address</label>
							<input
								value={walletAddress}
								onChange={_onChange(setWalletAddress)}
								className="border rounded block w-full"
							/>
						</div>

						<div className="mb-4">
							<label className="block">Your Vault Password</label>
							<input
								type="password"
								value={password}
								onChange={_onChange(setPassword)}
								className="border rounded block w-full"
							/>
							{error && (
								<div className="text-red-800 text-sm">Invalid password</div>
							)}
						</div>

						<button className="border rounded block w-full">Submit</button>
					</form>
				</div>
			}
		/>
	)
}

export default Component
