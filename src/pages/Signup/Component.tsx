import { FormEvent } from "react"
import AlertSvg from "../../assets/svgs/Alert"
import ClosedEyeSvg from "../../assets/svgs/ClosedEye"
import OpenEyeSvg from "../../assets/svgs/OpenEye"
import LayoutAuth from "../../components/LayoutAuth"
import TextInput from "../../components/TextInput"
import ValidationListItem from "../../components/ValidationListItem"
import { ROUTE_SIGNUP } from "../../utils/constants"
import { Button } from "@sonr-io/nebula-react"

type Props = {
	onSubmit: () => void
	errors: any
	validatePasswordOnChange: (value: string) => void
	passwordVisible: boolean
	togglePasswordVisible: () => void
	setPasswordConfirm: any
	password: string
	passwordConfirm: string
}

const Component = ({
	onSubmit,
	errors,
	validatePasswordOnChange,
	togglePasswordVisible,
	passwordVisible,
	setPasswordConfirm,
	password,
	passwordConfirm,
}: Props) => {
	function _onSubmit(event: FormEvent) {
		event.preventDefault()
		onSubmit()
	}

	return (
		<LayoutAuth
			route={ROUTE_SIGNUP}
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
				<div className="flex flex-col justify-center w-full max-w-sm">
					<h1 className="text-custom-xl font-extrabold mb-8 text-emphasis">
						Create Vault Password
					</h1>

					<form onSubmit={_onSubmit} className="w-full">
						<TextInput
							RightIcon={passwordVisible ? OpenEyeSvg : ClosedEyeSvg}
							rightIconOnClick={togglePasswordVisible}
							className="text-white mb-4"
							label="Your Vault Password"
							ariaLabel="Your Vault Password"
							handleOnChange={(event: React.ChangeEvent<HTMLInputElement>) =>
								validatePasswordOnChange(event.target.value)
							}
							value={password}
							type={passwordVisible ? "text" : "password"}
						/>
						<TextInput
							error={errors?.vaultPassword?.passwordsMatch}
							RightIcon={passwordVisible ? OpenEyeSvg : ClosedEyeSvg}
							rightIconOnClick={togglePasswordVisible}
							className="text-white"
							label="Re-enter Your Vault Password"
							ariaLabel="Re-enter Your Vault Password"
							handleOnChange={(event: React.ChangeEvent<HTMLInputElement>) =>
								setPasswordConfirm(event.target.value)
							}
							value={passwordConfirm}
							type={passwordVisible ? "text" : "password"}
						/>
						<div className="flex flex-col justify-start text-sm text-gray-600 mt-4">
							<ValidationListItem
								error={errors?.vaultPassword?.hasMinimumCharacters}
								label="At least 12 characters"
							/>
							<div className="h-2" />
							<ValidationListItem
								error={errors?.vaultPassword?.noSpaces}
								label="No spaces"
							/>
							<div className="h-2" />
							<ValidationListItem
								error={
									errors?.vaultPassword?.hasNumericCharacter ||
									errors?.vaultPassword?.hasLowercaseCharacter ||
									errors?.vaultPassword?.hasUppercaseCharacter ||
									errors?.vaultPassword?.hasSpecialCharacter
								}
								label="Combination of numbers, upper and lowercase letters, and special characters"
							/>
						</div>
						<Button
							type="submit"
							styling="border rounded block w-full mt-12 justify-center text-custom-md font-extrabold"
							label="Submit"
						/>
					</form>
				</div>
			}
		/>
	)
}

export default Component
