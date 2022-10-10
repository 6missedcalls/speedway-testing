import {
	NoSpaces,
	HasNoSpecialCharacter,
} from "@sonr-io/validation/dist/validation"
import validate from "@sonr-io/validation/dist/validator"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import {
	selectAddress,
	selectAlias,
	selectAuthenticationIsLoading,
	userBuyAlias,
} from "../../redux/slices/authenticationSlice"
import { AppDispatch } from "../../redux/store"
import { ROUTE_SCHEMAS, ROUTE_SIGNUP } from "../../utils/constants"
import AliasCreationComponent from "./Component"

const aliasRules = [
	{
		name: "noSpaces",
		validate: NoSpaces,
	},
	{
		name: "hasNoSpecialCharacter",
		validate: HasNoSpecialCharacter,
	},
	{
		name: "charactersLimits",
		validate: function (value: string) {
			if (value.length < 3 || value.length > 18)
				return new Error("Alias should have between 3 and 18 characters.")
			return true
		},
	},
]

function AliasCreationContainer() {
	const cachedAlias = useSelector(selectAlias)
	const address = useSelector(selectAddress)
	const loading = useSelector(selectAuthenticationIsLoading)
	const dispatch = useDispatch<AppDispatch>()
	const navigate = useNavigate()
	const [alias, setAlias] = useState("")
	const [errors, setErrors] = useState<Record<string, any>>({
		alias: {
			noSpaces: false,
			hasNoSpecialCharacter: false,
			charactersLimits: true,
		},
	})

	useEffect(() => {
		if (!address) {
			navigate(ROUTE_SIGNUP)
		}
	}, [address])

	useEffect(() => {
		if (cachedAlias) {
			navigate(ROUTE_SCHEMAS)
		}
	}, [cachedAlias])

	async function onSubmit() {
		const fields = {
			alias: {
				rules: aliasRules,
				value: alias,
			},
		}
		const { isValid, validationErrors } = validate({ fields })
		setErrors({ ...validationErrors })

		if (isValid) {
			try {
				const response = await dispatch<Record<string, any>>(
					userBuyAlias({ alias, creator: address })
				)
				if (response?.error) {
					setErrors({
						alias: {
							...errors.alias,
							taken: "This domain is already taken",
						},
					})
				} else {
					navigate(ROUTE_SCHEMAS)
				}
			} catch (err) {
				console.error(err)
			}
		}
	}

	function validateAliasOnChange(value: string) {
		const fields = {
			alias: {
				rules: aliasRules,
				value,
			},
		}
		const { validationErrors } = validate({ fields })

		setErrors({ ...validationErrors })
		setAlias(value)
	}

	return (
		<AliasCreationComponent
			onSubmit={onSubmit}
			errors={errors}
			alias={alias}
			validateAliasOnChange={validateAliasOnChange}
			loading={loading}
		/>
	)
}

export default AliasCreationContainer
