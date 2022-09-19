import { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import RefreshSvg from "../../../../assets/svgs/Refresh"
import { AppModalContext } from "../../../../contexts/appModalContext/appModalContext"
import {
	selectBuckets,
	selectBucketsLoading,
	updateBucket,
} from "../../../../redux/slices/bucketSlice"
import {
	selectObjectsLoading,
	userCreateObject,
	userGetBucketObjects,
} from "../../../../redux/slices/objectsSlice"
import {
	selectSchemasLoading,
	userGetSchema,
} from "../../../../redux/slices/schemasSlice"
import { IobjectPropertyChange, SchemaMeta } from "../../../../utils/types"
import NewObjectModalContentComponent from "./Component"

export interface NewObjectModalContentContainerProps {
	selectedSchemaDid: string
	selectedBucket: string
	setSelectedBucket: React.Dispatch<React.SetStateAction<string>>
	setSelectedSchema: React.Dispatch<React.SetStateAction<string>>
	initialSchemaFields: Array<Record<string, any>>
	schemas: Array<SchemaMeta>
}

function NewObjectModalContentContainer({
	selectedSchemaDid,
	setSelectedBucket,
	setSelectedSchema,
	selectedBucket,
	initialSchemaFields = [],
	schemas,
}: NewObjectModalContentContainerProps) {
	const { closeModal } = useContext(AppModalContext)
	const dispatch: Function = useDispatch()
	const buckets = useSelector(selectBuckets)
	const [error, setError] = useState("")
	const [properties, setProperties] = useState(initialSchemaFields)
	const schemasLoading = useSelector(selectSchemasLoading)
	const bucketsLoading = useSelector(selectBucketsLoading)
	const objectsLoading = useSelector(selectObjectsLoading)
	const loading = schemasLoading || objectsLoading || bucketsLoading

	useEffect(() => {
		if (selectedSchemaDid) {
			getSchema()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSchemaDid])

	async function getSchema() {
		const selectedSchemaData = schemas.find(
			(item) => item.did === selectedSchemaDid
		)!
		const getSchemaPayload = {
			schema: selectedSchemaData.did,
		}

		const getSchemaResponse = await dispatch(
			userGetSchema({ schema: getSchemaPayload })
		)

		setProperties(getSchemaResponse.payload)
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
			(item) => item.did === selectedSchemaDid
		)

		const castValue = (type: Number, value: string) => {
			switch (type) {
				case 1:
					if (value === "true") return true
					if (value === "false") return false
					return null
				case 2:
					return isNaN(parseInt(value)) ? null : parseInt(value)
				case 3:
					return isNaN(parseFloat(value)) ? null : parseFloat(value)
				default:
					return !value ? null : value
			}
		}

		const objectPayload = {
			schemaDid: selectedSchemaDid,
			label: selectedSchemaData?.label || "",
			object: properties.reduce(
				(acc, item) => ({
					...acc,
					[item.name]: castValue(item.type, item.value),
				}),
				{}
			),
		}

		if (
			!Object.keys(objectPayload.object).every(
				(key) => objectPayload.object[key] !== null
			)
		) {
			setError("Properties are required.")
			return
		}

		let floatError = false
		properties.forEach((item) => {
			if (item.type === 3) {
				const splitValue = item.value.split(".")
				if (
					splitValue.length &&
					(splitValue.length < 2 || parseFloat(splitValue[1]) === 0)
				) {
					setError("Float numbers can't have zero as decimal part.")
					floatError = true
				}
			}
		})

		if (floatError) return

		const response = await dispatch(userCreateObject({ ...objectPayload }))

		if (response.error) {
			setError("Could not create object.")
			console.error(error)
			return
		}

		const bucketUpdatePayload = {
			bucketDid: selectedBucket,
			objectCid: response.payload,
			schemaDid: selectedSchemaDid,
		}

		await dispatch(updateBucket({ ...bucketUpdatePayload }))
		
		dispatch(
			userGetBucketObjects({
				bucketDid: selectedBucket,
			})
		)
		
		closeModal()
	}

	return (
		<>
			{loading ? (
				<div className="flex flex-col items-center">
					<div className="w-28 m-20 animate-reverse-spin">
						<RefreshSvg />
					</div>
				</div>
			) : (
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
			)}
		</>
	)
}

export default NewObjectModalContentContainer
