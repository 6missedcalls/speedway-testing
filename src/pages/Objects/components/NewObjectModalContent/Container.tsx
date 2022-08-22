import { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppModalContext } from "../../../../contexts/appModalContext/appModalContext"
import { selectAddress } from "../../../../redux/slices/authenticationSlice"
import { userCreateObject } from "../../../../redux/slices/objectsSlice"
import { userGetSchema } from "../../../../redux/slices/schemasSlice"
import { IobjectPropertyChange } from "../../../../utils/types"
import NewObjectModalContentComponent from "./Component"

interface NewObjectModalContentContainerProps {
	initialSelectedSchema: string
	initialSchemaFields: Array<any>
	schemas: Array<any>
}

function NewObjectModalContentContainer({
	initialSelectedSchema,
	initialSchemaFields = [],
	schemas,
}: NewObjectModalContentContainerProps) {
	const { closeModal } = useContext(AppModalContext)
	const dispatch = useDispatch<any>()
	const [modalSelectedSchema, setModalSelectedSchema] = useState(
		initialSelectedSchema
	)
	const [properties, setProperties] = useState(initialSchemaFields)
	const address = useSelector(selectAddress)

	useEffect(() => {
		if (modalSelectedSchema) {
			getSchema()
		}
	}, [modalSelectedSchema])

	async function getSchema() {
		const selectedSchemaData = schemas.find(
			(item) => item.schema.did === modalSelectedSchema
		)!
		const getSchemaPayload = {
			address,
			creator: selectedSchemaData.creator,
			schema: selectedSchemaData.did,
		}

		const getSchemaResponse = await dispatch(
			userGetSchema({ schema: getSchemaPayload })
		)

		setProperties(getSchemaResponse.payload.fields)
	}

	function handlePropertiesChange({ value, index }: IobjectPropertyChange) {
		const newProperties = [...properties]

		newProperties.splice(index, 1, {
			...properties[index],
			value,
		})

		setProperties(newProperties)
	}

	async function save() {
		const selectedSchemaData = schemas.find(
			(item) => item.schema.did === modalSelectedSchema
		)!
		const objectPayload = {
			schemaDid: modalSelectedSchema,
			label: selectedSchemaData.schema.label,
			object: properties.reduce((acc, item) => {
				return {
					...acc,
					[item.name]: item.value,
				}
			}, {}),
		}

		await dispatch(userCreateObject({ ...objectPayload }))
		closeModal()
	}

	return (
		<NewObjectModalContentComponent
			schemas={schemas}
			save={save}
			modalSelectedSchema={modalSelectedSchema}
			setModalSelectedSchema={setModalSelectedSchema}
			properties={properties}
			handlePropertiesChange={handlePropertiesChange}
			closeModal={closeModal}
		/>
	)
}

export default NewObjectModalContentContainer
