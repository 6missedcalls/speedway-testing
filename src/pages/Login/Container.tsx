import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import AuthenticationLoading from "../../components/AuthenticationLoading"
import {
	selectAlias,
	selectAuthenticationIsLoading,
	selectIsLogged,
	selectLoginError,
	userGetAddressByAlias,
	userLogin,
} from "../../redux/slices/authenticationSlice"
import { ROUTE_LOGIN, ROUTE_SCHEMAS } from "../../utils/constants"
import { IsRequired } from "@sonr-io/validation/dist/validation"
import validate from "@sonr-io/validation/dist/validator"
import { AppDispatch } from "../../redux/store"
import LoginComponent from "./Component"
import { isAddress } from "../../utils/string"

const addressOrAliasRules = [
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
	const [addressOrAlias, setAddressOrAlias] = useState("")
	const [password, setPassword] = useState("")
	const [passwordVisible, setPasswordVisible] = useState(false)
	const dispatch = useDispatch<AppDispatch>()

	const navigate = useNavigate()
	const isLogged = useSelector(selectIsLogged)
	const alias = useSelector(selectAlias)
	const loginError = useSelector(selectLoginError)
	const loading = useSelector(selectAuthenticationIsLoading)
	const [errors, setErrors] = useState<Record<string, any>>({})

	useEffect(() => {
		if (isLogged) {
			navigate(ROUTE_SCHEMAS)
		}
	}, [isLogged, alias, navigate])

	async function login() {
		const fields = {
			addressOrAlias: {
				rules: addressOrAliasRules,
				value: addressOrAlias,
			},
			vaultPassword: {
				rules: paswordRules,
				value: password,
			},
		}

		const { isValid, validationErrors } = validate({ fields })
		setErrors({ ...validationErrors })

		if (!isValid) return

		if(isAddress(addressOrAlias)){
			const response = await dispatch<Record<string,any>>(userLogin({ walletAddress: addressOrAlias, password }))
			if(!response?.error) navigate(ROUTE_SCHEMAS)
		}else{
			const response = await dispatch<Record<string,any>>(userGetAddressByAlias({ alias: addressOrAlias }))
			if(!response?.error){
				const address = response.payload
				await dispatch(userLogin({ walletAddress: address, password }))
				navigate(ROUTE_SCHEMAS)
			}
		}
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
			addressOrAlias={addressOrAlias}
			setAddressOrAlias={setAddressOrAlias}
			password={password}
			loginError={loginError ? "Invalid domain or password." : ""}
		/>
	)
}

export default Container
