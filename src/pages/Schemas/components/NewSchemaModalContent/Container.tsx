import { useContext, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppModalContext } from "../../../../contexts/appModalContext/appModalContext"
import { selectAddress } from "../../../../redux/slices/authenticationSlice"
import {
	selectSchemasLoading,
	userCreateSchema,
} from "../../../../redux/slices/schemasSlice"
import { IschemaTypeMap, schemaTypeMap } from "../../../../utils/mappings"
import {
	Iproperty,
	handlePropertyChangeProps,
	Ischema,
	InewSchema,
} from "../../../../utils/types"
import NewSchemaModalContentComponent from "./Component"

const emptyProperty = {
	name: "",
	type: "string",
}

function NewSchemaModalContentContainer() {
	const dispatch = useDispatch<any>()
	const address = useSelector(selectAddress)
	const { closeModal } = useContext(AppModalContext)
	const [schemaName, setSchemaName] = useState("")
	const [properties, setProperties] = useState<Array<Iproperty>>([
		emptyProperty,
	])

	function addProperty() {
		setProperties([...properties, emptyProperty])
	}

	function handlePropertyChange({ index, data }: handlePropertyChangeProps) {
		const newProperties = [...properties]
		newProperties.splice(index, 1, {
			...properties[index],
			...data,
		})
		setProperties(newProperties)
	}

	function saveSchema() {
		if (!schemaName) return

		const schema: InewSchema = {
			address,
			fields: {
				...properties
					.filter((property) => property.name && property.type)
					.reduce((acc, item) => {
						return {
							...acc,
							[item.name]: schemaTypeMap[item.type as keyof IschemaTypeMap],
						}
					}, {}),
			},
			label: schemaName,
		}

		dispatch(userCreateSchema({ schema }))
		closeModal()
	}

	return (
		<NewSchemaModalContentComponent
			closeModal={closeModal}
			properties={properties}
			addProperty={addProperty}
			schemaName={schemaName}
			setSchemaName={setSchemaName}
			handlePropertyChange={handlePropertyChange}
			saveSchema={saveSchema}
		/>
	)
}

export default NewSchemaModalContentContainer
