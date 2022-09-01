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
	userGetAllBucketObjects,
} from "../../../../redux/slices/objectsSlice"
import { userGetSchema } from "../../../../redux/slices/schemasSlice"
import { AppDispatch } from "../../../../redux/store"
import { IobjectPropertyChange, Ischema } from "../../../../utils/types"
import NewObjectModalContentComponent from "./Component"

export interface NewObjectModalContentContainerProps {
	selectedSchemaDid: string
	setSelectedSchema: React.Dispatch<React.SetStateAction<string>>
	initialSchemaFields: Array<Record<string, any>>
	schemas: Array<Ischema>
}

function NewObjectModalContentContainer({
	selectedSchemaDid,
	setSelectedSchema,
	initialSchemaFields = [],
	schemas,
}: NewObjectModalContentContainerProps) {
	const { closeModal } = useContext(AppModalContext)
	const dispatch = useDispatch<AppDispatch>()
	const buckets = useSelector(selectBuckets)
	const [error, setError] = useState("")
	const [selectedBucket, setSelectedBucket] = useState(buckets[0].did)
	const [properties, setProperties] = useState(initialSchemaFields)
	const address = useSelector(selectAddress)

	useEffect(() => {
		if (selectedSchemaDid) {
			getSchema()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSchemaDid])

	async function getSchema() {
		const selectedSchemaData = schemas.find(
			(item) => item.schema.did === selectedSchemaDid
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
		setError("")

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
			(item) => item.schema.did === selectedSchemaDid
		)

		const castValue = (type: Number, value: string) => {
			switch (type) {
				case 2:
					return parseInt(value)
				default:
					return value
			}
		}

		const objectPayload = {
			bucketDid: selectedBucket,
			schemaDid: selectedSchemaDid,
			label: selectedSchemaData?.schema.label,
			object: properties.reduce(
				(acc, item) => ({
					...acc,
					[item.name]: castValue(item.field, item.value),
				}),
				{}
			),
		}

		if (
			!Object.keys(objectPayload.object).every(
				(key) => !!objectPayload.object[key]
			)
		) {
			setError("Properties are required.")
			return
		}

		closeModal()

		const object = await dispatch(userCreateObject({ ...objectPayload }))

		const bucketUpdatePayload = {
			bucketDid: selectedBucket,
			objectCid: object.payload.Cid,
			objectName: object.payload.Label,
			schemaDid: selectedSchemaDid,
		}

		await dispatch(updateBucket({ ...bucketUpdatePayload }))

		dispatch(
			userGetAllBucketObjects({
				buckets: buckets.map((item) => item.did),
			})
		)
	}

	return (
		<NewObjectModalContentComponent
			onClose={closeModal}
			onSave={save}
			onChangeSchema={setSelectedSchema}
			onChangeBucket={handleChangeBucket}
			onChangeProperty={handlePropertiesChange}
			schemas={schemas}
			error={error}
			buckets={buckets}
			properties={properties}
			selectedSchemaDid={selectedSchemaDid}
			selectedBucket={selectedBucket}
		/>
	)
}

export default NewObjectModalContentContainer
