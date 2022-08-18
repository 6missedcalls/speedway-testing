import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import AuthenticationLoading from "../../components/AuthenticationLoading"
import {
	selectAuthenticationIsLoading,
	userCreateAccount,
	userLogin,
} from "../../redux/slices/authenticationSlice"
import { ROUTE_POST_SIGNUP, ROUTE_SIGNUP } from "../../utils/constants"
import {
	hasAtLeastOneLowercaseCharacter,
	hasAtLeastOneNumber,
	hasAtLeastOneSpecialCharacter,
	hasAtLeastOneUppercaseCharacter,
	noSpaces,
} from "../../utils/validation/rules"
import validate from "../../utils/validation/validator"
import Signup from "./Component"

const passwordRules = [
	{
		name: "noSpaces",
		validate: noSpaces,
	},
	{
		name: "hasSpecialCharacter",
		validate: hasAtLeastOneSpecialCharacter,
	},
	{
		name: "hasUppercaseCharacter",
		validate: hasAtLeastOneUppercaseCharacter,
	},
	{
		name: "hasLowercaseCharacter",
		validate: hasAtLeastOneLowercaseCharacter,
	},
	{
		name: "hasNumericCharacter",
		validate: hasAtLeastOneNumber,
	},
	{
		name: "hasMinimumCharacters",
		validate: function (value: string) {
			if (value.length < 12)
				return new Error("Password should have at least 12 characters.")
			return true
		},
	},
]

const Container = () => {
	const [password, setPassword] = useState("")
	const [passwordConfirm, setPasswordConfirm] = useState("")
	const [passwordVisible, setPasswordVisible] = useState(false)
	const [errors, setErrors] = useState<any>({
		vaultPassword: {
			noSpaces: false,
			hasSpecialCharacter: true,
			hasUppercaseCharacter: true,
			hasLowercaseCharacter: true,
			hasNumericCharacter: true,
			hasMinimumCharacters: true,
			invalidPassword: false,
		},
	})

	const loading = useSelector(selectAuthenticationIsLoading)
	const navigate = useNavigate()
	const dispatch = useDispatch<any>()

	async function createAccountAndLogin() {
		if (!validateStatePassword()) return

		const createAccountResponse = await dispatch(
			userCreateAccount({ password })
		)
		const { payload } = createAccountResponse

		await dispatch(userLogin({ walletAddress: payload.Address, password }))
		navigate(ROUTE_POST_SIGNUP)
	}

	function validateStatePassword() {
		const passwordsMatchRule = {
			name: "passwordsMatch",
			validate: function (value: string) {
				if (value !== passwordConfirm)
					return new Error("Passwords don't match.")
				return true
			},
		}

		const fields = {
			vaultPassword: {
				rules: [...passwordRules, passwordsMatchRule],
				value: password,
			},
		}

		const { isValid, validationErrors } = validate({ fields })

		setErrors({
			...errors,
			...validationErrors,
		})

		return isValid
	}

	function validatePasswordOnChange(value: string) {
		const fields = {
			vaultPassword: {
				rules: passwordRules,
				value: value,
			},
		}

		const { validationErrors } = validate({ fields })
		setErrors({ ...validationErrors })

		setPassword(value)
	}

	function togglePasswordVisible() {
		setPasswordVisible(!passwordVisible)
	}

	if (loading) {
		return <AuthenticationLoading route={ROUTE_SIGNUP} />
	}

	return (
		<Signup
			onSubmit={createAccountAndLogin}
			validatePasswordOnChange={validatePasswordOnChange}
			password={password}
			passwordConfirm={passwordConfirm}
			setPasswordConfirm={setPasswordConfirm}
			passwordVisible={passwordVisible}
			togglePasswordVisible={togglePasswordVisible}
			errors={errors}
		/>
	)
}

export default Container
