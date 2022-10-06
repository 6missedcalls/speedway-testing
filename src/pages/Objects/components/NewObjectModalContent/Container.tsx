import {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react"
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
import { selectSchemasLoading } from "../../../../redux/slices/schemasSlice"
import { SchemaField, SchemaMeta } from "../../../../utils/types"
import NewObjectModalContentComponent from "./Component"

export interface NewObjectModalContentContainerProps {
	selectedSchema: string
	selectedBucket: string
	onChangeBucket: Dispatch<SetStateAction<string>>
	onChangeSchema: Dispatch<SetStateAction<string>>
	schemas: Array<SchemaMeta>
}

function NewObjectModalContentContainer({
	selectedSchema,
	selectedBucket,
	onChangeBucket,
	onChangeSchema,
	schemas,
}: NewObjectModalContentContainerProps) {
	const { closeModal } = useContext(AppModalContext)
	const dispatch: Function = useDispatch()
	const buckets = useSelector(selectBuckets)
	const [error, setError] = useState("")
	const [properties, setProperties] = useState<SchemaField[]>([])
	const [values, setValues] = useState<string[]>([])
	const schemasLoading = useSelector(selectSchemasLoading)
	const bucketsLoading = useSelector(selectBucketsLoading)
	const objectsLoading = useSelector(selectObjectsLoading)
	const loading = schemasLoading || objectsLoading || bucketsLoading

	useEffect(() => {
		const schema = schemas.find((schema) => schema.did === selectedSchema)!
		setProperties(schema.fields)
	}, [selectedSchema])

	function handlePropertiesChange(index: number, value: string) {
		setError("")
		const newValues = [...values]
		newValues[index] = value
		setValues(newValues)
	}

	function unsetPropertyValue(index: number) {
		const newValues = [...values]
		newValues[index] = ""
		setValues(newValues)
	}

	async function save() {
		const schema = schemas.find((item) => item.did === selectedSchema)!

		const castValue = (type: Number, value: string) => {
			if (!value) return ""

			switch (type) {
				case 0:
					return value ? JSON.parse(value) : null
				case 1:
					if (value === "true") return true
					if (value === "false") return false
					return null
				case 2:
					return isNaN(parseInt(value)) ? null : parseInt(value)
				case 3:
					return isNaN(parseFloat(value)) ? null : parseFloat(value)
				case 5:
					return {
						bytes: value,
					}
				default:
					return !value ? null : value
			}
		}

		const objectPayload = {
			schemaDid: selectedSchema,
			label: schema.label || "",
			object: properties.reduce((acc, item, index) => {
				return {
					...acc,
					[item.name]: castValue(item.type, values[index]),
				}
			}, {}),
		}

		if (
			!Object.values(objectPayload.object).every((value) => {
				return Array.isArray(value)
					? value.every((item) => item !== "")
					: value !== ""
			})
		) {
			setError("All properties are required")
			return
		}

		let floatError = false
		properties.forEach((item, index) => {
			if (item.type === 3) {
				const splitValue = values[index].split(".")
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
			schemaDid: selectedSchema,
		}

		await dispatch(updateBucket({ ...bucketUpdatePayload }))
		dispatch(userGetBucketObjects({ bucketDid: selectedBucket }))

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
					schemas={schemas}
					buckets={buckets}
					selectedSchema={selectedSchema}
					selectedBucket={selectedBucket}
					onClose={closeModal}
					onSave={save}
					onChangeSchema={onChangeSchema}
					onChangeBucket={onChangeBucket}
					onChangeProperty={handlePropertiesChange}
					error={error}
					properties={properties}
					unsetPropertyValue={unsetPropertyValue}
					setError={setError}
				/>
			)}
		</>
	)
}

export default NewObjectModalContentContainer
