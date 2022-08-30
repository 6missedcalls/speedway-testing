import { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppModalContext } from "../../../../contexts/appModalContext/appModalContext"
import { selectAddress } from "../../../../redux/slices/authenticationSlice"
import {
	selectBuckets,
	updateBucket,
} from "../../../../redux/slices/bucketSlice"
import {
	userCreateObject,
	userGetBucketObjects,
} from "../../../../redux/slices/objectsSlice"
import { userGetSchema } from "../../../../redux/slices/schemasSlice"
import { AppDispatch } from "../../../../redux/store"
import { IobjectPropertyChange, Ischema } from "../../../../utils/types"
import NewObjectModalContentComponent from "./Component"

export interface NewObjectModalContentContainerProps {
	initialSelectedSchema: string
	initialSchemaFields: Array<Record<string, any>>
	schemas: Array<Ischema>
}

function NewObjectModalContentContainer({
	initialSelectedSchema,
	initialSchemaFields = [],
	schemas,
}: NewObjectModalContentContainerProps) {
	const { closeModal } = useContext(AppModalContext)
	const dispatch = useDispatch<AppDispatch>()
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
			label: selectedSchemaData?.schema.label,
			object: properties.reduce((acc, item) => {
				return {
					...acc,
					[item.name]: item.value,
				}
			}, {}),
		}

		const object = await dispatch(userCreateObject({ ...objectPayload }))

		const bucketUpdatePayload = {
			bucketDid: selectedBucket,
			objectCid: object.payload.reference.Cid,
		}

		await dispatch(updateBucket({ ...bucketUpdatePayload }))

		dispatch(userGetBucketObjects({ bucket: selectedBucket }))

		closeModal()
	}

	return (
		<NewObjectModalContentComponent
			onClose={closeModal}
			onSave={save}
			onChangeSchema={setModalSelectedSchema}
			onChangeBucket={handleChangeBucket}
			onChangeProperty={handlePropertiesChange}
			schemas={schemas}
			buckets={buckets}
			properties={properties}
			selectedSchema={modalSelectedSchema}
			selectedBucket={selectedBucket}
		/>
	)
}

export default NewObjectModalContentContainer
