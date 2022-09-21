import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import AuthenticationLoading from "../../components/AuthenticationLoading"
import {
	selectAlias,
	selectAuthenticationIsLoading,
	selectIsLogged,
	userCreateAccount,
	userLogin,
} from "../../redux/slices/authenticationSlice"
import { ROUTE_BUY_ALIAS, ROUTE_SCHEMAS, ROUTE_SIGNUP } from "../../utils/constants"
import {
	HasAtLeastOneLowercaseCharacter,
	HasAtLeastOneNumber,
	HasAtLeastOneSpecialCharacter,
	HasAtLeastOneUppercaseCharacter,
	NoSpaces,
} from "@sonr-io/validation/dist/validation"
import validate from "@sonr-io/validation/dist/validator"
import Signup from "./Component"

const passwordRules = [
	{
		name: "noSpaces",
		validate: NoSpaces,
	},
	{
		name: "hasSpecialCharacter",
		validate: HasAtLeastOneSpecialCharacter,
	},
	{
		name: "hasUppercaseCharacter",
		validate: HasAtLeastOneUppercaseCharacter,
	},
	{
		name: "hasLowercaseCharacter",
		validate: HasAtLeastOneLowercaseCharacter,
	},
	{
		name: "hasNumericCharacter",
		validate: HasAtLeastOneNumber,
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
	const isLogged = useSelector(selectIsLogged)
	const [password, setPassword] = useState("")
	const [passwordConfirm, setPasswordConfirm] = useState("")
	const [passwordVisible, setPasswordVisible] = useState(false)
	const [errors, setErrors] = useState<Record<string, any>>({
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
	const dispatch: Function = useDispatch()

	useEffect(() => {
		if (isLogged) {
			navigate(ROUTE_SCHEMAS)
		}
	}, [isLogged, navigate])

	async function createAccountAndLogin() {
		if (!validateStatePassword()) return

		const createAccountResponse = await dispatch(
			userCreateAccount({ password })
		)
		const { address } = createAccountResponse.payload
		await dispatch(userLogin({ addressOrAlias: address, password }))
		navigate(ROUTE_BUY_ALIAS)
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
