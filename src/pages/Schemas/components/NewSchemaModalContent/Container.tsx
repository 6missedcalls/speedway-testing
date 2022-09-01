import { useContext, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppModalContext } from "../../../../contexts/appModalContext/appModalContext"
import {
	selectAddress,
	selectLoginError,
} from "../../../../redux/slices/authenticationSlice"
import { userCreateSchema } from "../../../../redux/slices/schemasSlice"
import { AppDispatch } from "../../../../redux/store"
import { IschemaTypeMap, schemaTypeMap } from "../../../../utils/mappings"
import { isEmptyObject } from "../../../../utils/object"
import {
	Iproperty,
	handlePropertyChangeProps,
	InewSchema,
} from "../../../../utils/types"
import NewSchemaModalContentComponent from "./Component"

const emptyProperty = {
	name: "",
	type: "string",
}

function NewSchemaModalContentContainer() {
	const dispatch = useDispatch<AppDispatch>()
	const address = useSelector(selectAddress)
	const { closeModal } = useContext(AppModalContext)
	const [error, setError] = useState("")
	const [schemaName, setSchemaName] = useState("")
	const [properties, setProperties] = useState<Array<Iproperty>>([
		emptyProperty,
	])

	function addProperty() {
		setProperties([...properties, emptyProperty])
	}

	function handlePropertyChange({ index, data }: handlePropertyChangeProps) {
		if (data.name && !/(^[a-zA-Z])([a-zA-Z0-9]?)+$/g.test(data.name)) {
			setError(
				"Properties must start with letters and contain only letters and numbers."
			)
			return
		}

		setError("")
		const newProperties = [...properties]
		newProperties.splice(index, 1, {
			...properties[index],
			...data,
		})
		setProperties(newProperties)
	}

	function saveSchema() {
		if (!schemaName || properties.length === 0) {
			setError("Schema name is required.")
			return
		}

		const filledFields = properties
			.filter((property) => property.name && property.type)
			.reduce((acc, item) => {
				return {
					...acc,
					[item.name]: schemaTypeMap[item.type as keyof IschemaTypeMap],
				}
			}, {})

		if (isEmptyObject(filledFields)) {
			setError("Properties are required.")
			return
		}

		const schema: InewSchema = {
			address,
			fields: {
				...filledFields,
			},
			label: schemaName,
		}

		dispatch(userCreateSchema({ schema }))
		closeModal()
	}

	function onChangeSchemaName(value: string) {
		setError("")
		setSchemaName(value)
	}

	return (
		<NewSchemaModalContentComponent
			closeModal={closeModal}
			properties={properties}
			addProperty={addProperty}
			schemaName={schemaName}
			error={error}
			onChangeSchemaName={onChangeSchemaName}
			handlePropertyChange={handlePropertyChange}
			saveSchema={saveSchema}
		/>
	)
}

export default NewSchemaModalContentContainer
