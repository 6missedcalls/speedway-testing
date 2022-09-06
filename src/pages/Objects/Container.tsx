import { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppModalContext } from "../../contexts/appModalContext/appModalContext"
import { selectAddress } from "../../redux/slices/authenticationSlice"
import {
	selectBuckets,
	selectBucketsLoading,
	userGetAllBuckets,
} from "../../redux/slices/bucketSlice"
import {
	selectObjectsList,
	selectObjectsLoading,
	userGetAllObjects,
} from "../../redux/slices/objectsSlice"
import {
	selectSchemasLoading,
	selectSchemasMetadataList,
	userGetAllSchemas,
	userGetSchema,
} from "../../redux/slices/schemasSlice"
import { GetSchemaFieldsResponse } from "../../service/getSchemaFields"
import { MODAL_CONTENT_NEW_OBJECT } from "../../utils/constants"
import {
	SearchableList,
	SearchableListItem,
	SonrObject,
	SchemaField,
} from "../../utils/types"
import ObjectsPageComponent from "./Component"

function ObjectsPageContainer() {
	const { setModalContent, openModal } = useContext(AppModalContext)
	const dispatch: Function = useDispatch()
	const [selectedSchemaDid, setSelectedSchema] = useState("")
	const [schemaFields, setSchemaFields] = useState<SchemaField[]>([])
	const objectsList = useSelector(selectObjectsList)
	const schemasLoading = useSelector(selectSchemasLoading)
	const bucketsLoading = useSelector(selectBucketsLoading)
	const objectsLoading = useSelector(selectObjectsLoading)
	const buckets = useSelector(selectBuckets)
	const address = useSelector(selectAddress)
	const schemaMetadata = useSelector(selectSchemasMetadataList)
	const loading = schemasLoading || objectsLoading || bucketsLoading

	useEffect(() => {
		initialize()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (buckets.length > 0) {
			dispatch(
				userGetAllObjects({
					bucketDids: buckets.map((item) => item.did),
				})
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [buckets])

	useEffect(() => {
		if (selectedSchemaDid) {
			getSchema()
			setModalContent({
				content: MODAL_CONTENT_NEW_OBJECT,
				props: {
					selectedSchemaDid,
					setSelectedSchema,
					initialSchemaFields: schemaFields,
					schemas: schemaMetadata,
				},
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSchemaDid])

	async function getSchema() {
		const selectedSchemaData = schemaMetadata.find(
			(item) => item.did === selectedSchemaDid
		)!
		const getSchemaPayload = {
			address,
			creator: "",
			schema: selectedSchemaData.did,
		}

		const getSchemaResponse: GetSchemaFieldsResponse = await dispatch(
			userGetSchema({ schema: getSchemaPayload })
		)

		setSchemaFields(getSchemaResponse.fields)
	}

	async function initialize() {
		await Promise.all([
			dispatch(userGetAllSchemas),
			dispatch(userGetAllBuckets(address)),
		])
		if (schemaMetadata.length > 0) {
			setSelectedSchema(schemaMetadata[0].did)
		}
	}

	function openNewObjectModal() {
		setModalContent({
			content: MODAL_CONTENT_NEW_OBJECT,
			props: {
				selectedSchemaDid,
				setSelectedSchema,
				initialSchemaFields: schemaFields,
				schemas: schemaMetadata,
			},
		})
		openModal()
	}

	function mapToListFormat(): SearchableList {
		return objectsList
			.filter((item: SonrObject) => item.schemaDid === selectedSchemaDid)
			.map(({ cid, data }: SonrObject): SearchableListItem => {
				const listItem: SearchableListItem = {}
				listItem.cid = { text: cid }
				Object.keys(data).forEach((key) => {
					listItem[key] = { text: data[key].toString() }
				})
				return listItem
			})
	}

	return (
		<ObjectsPageComponent
			schemas={schemaMetadata}
			selectedSchemaDid={selectedSchemaDid}
			setSelectedSchema={setSelectedSchema}
			openNewObjectModal={openNewObjectModal}
			loading={loading}
			list={mapToListFormat()}
			bucketCount={buckets.length}
			schemaCount={schemaMetadata.length}
		/>
	)
}

export default ObjectsPageContainer
