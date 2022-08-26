import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import AuthenticationLoading from "../../components/AuthenticationLoading"
import {
	selectAuthenticationIsLoading,
	selectIsLogged,
	selectLoginError,
	userLogin,
} from "../../redux/slices/authenticationSlice"
import { ROUTE_LOGIN } from "../../utils/constants"
import { IsRequired } from "@sonr-io/validation/dist/validation"
import validate from "@sonr-io/validation/dist/validator"
import { AppDispatch } from "../../redux/store"
import LoginComponent from "./Component"

const walletAddressRules = [
	{
		name: "isRequired",
		validate: IsRequired,
	},
]

const paswordRules = [
	{
		name: "isRequired",
		validate: IsRequired,
	},
]

const Container = () => {
	const [walletAddress, setWalletAddress] = useState("")
	const [password, setPassword] = useState("")
	const [passwordVisible, setPasswordVisible] = useState(false)
	const dispatch = useDispatch<AppDispatch>()

	const navigate = useNavigate()
	const isLogged = useSelector(selectIsLogged)
	const loginError = useSelector(selectLoginError)
	const loading = useSelector(selectAuthenticationIsLoading)
	const [errors, setErrors] = useState<Record<string, any>>({})

	useEffect(() => {
		if (isLogged) {
			navigate("/schema")
		}
	}, [isLogged, navigate])

	function login() {
		const fields = {
			walletAddress: {
				rules: walletAddressRules,
				value: walletAddress,
			},
			vaultPassword: {
				rules: paswordRules,
				value: password,
			},
		}

		const { isValid, validationErrors } = validate({ fields })
		setErrors({ ...validationErrors })

		if (!isValid) return

		dispatch(userLogin({ walletAddress, password }))
	}

	function togglePasswordVisible() {
		setPasswordVisible(!passwordVisible)
	}

	if (loading) {
		return <AuthenticationLoading route={ROUTE_LOGIN} />
	}

	return (
		<LoginComponent
			onSubmit={login}
			errors={errors}
			togglePasswordVisible={togglePasswordVisible}
			setPassword={setPassword}
			passwordVisible={passwordVisible}
			walletAddress={walletAddress}
			setWalletAddress={setWalletAddress}
			password={password}
			loginError={loginError ? "Invalid domain or password." : ""}
		/>
	)
}

export default Container
