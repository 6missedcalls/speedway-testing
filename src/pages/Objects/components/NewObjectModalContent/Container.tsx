import { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppModalContext } from "../../../../contexts/appModalContext/appModalContext"
import { selectAddress } from "../../../../redux/slices/authenticationSlice"
import {
	selectBuckets,
	updateBucket,
} from "../../../../redux/slices/bucketSlice"
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
	const buckets = useSelector(selectBuckets)
	const [selectedBucket, setSelectedBucket] = useState(buckets[0].did)
	const [properties, setProperties] = useState(initialSchemaFields)
	const address = useSelector(selectAddress)

	useEffect(() => {
		if (modalSelectedSchema) {
			getSchema()
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
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

	function handleChangeBucket(value: string) {
		setSelectedBucket(value)
	}

	async function save() {
		const selectedSchemaData = schemas.find(
			(item) => item.schema.did === modalSelectedSchema
		)

		const objectPayload = {
			bucketDid: selectedBucket,
			schemaDid: modalSelectedSchema,
			label: selectedSchemaData.schema.label,
			object: properties.reduce((acc, item) => {
				return {
					...acc,
					[item.name]: item.value,
				}
			}, {}),
		}

		const object = await dispatch(userCreateObject({ ...objectPayload }))

		const bucketUpdatePayload = {
			bucket: selectedBucket,
			objects: [object.payload.reference.Cid],
		}

		await dispatch(updateBucket({ ...bucketUpdatePayload }))

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
			buckets={buckets}
			selectedBucket={selectedBucket}
			handleChangeBucket={handleChangeBucket}
		/>
	)
}

export default NewObjectModalContentContainer
