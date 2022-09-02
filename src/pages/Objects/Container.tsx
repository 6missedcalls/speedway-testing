import { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppModalContext } from "../../contexts/appModalContext/appModalContext"
import { selectAddress } from "../../redux/slices/authenticationSlice"
import {
	getAllBuckets,
	selectBuckets,
	selectBucketsLoading,
} from "../../redux/slices/bucketSlice"
import {
	selectObjectsList,
	selectObjectsLoading,
	userGetAllBucketObjects,
} from "../../redux/slices/objectsSlice"
import {
	selectSchemasLoading,
	selectSchemasMetadataList,
	userGetAllSchemas,
	userGetSchema,
} from "../../redux/slices/schemasSlice"
import { AppDispatch } from "../../redux/store"
import { MODAL_CONTENT_NEW_OBJECT } from "../../utils/constants"
import ObjectsPageComponent from "./Component"

function ObjectsPageContainer() {
	const { setModalContent, openModal } = useContext(AppModalContext)
	const dispatch = useDispatch<AppDispatch>()
	const [selectedSchemaDid, setSelectedSchema] = useState("")
	const [schemaFields, setSchemaFields] = useState("")
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
				userGetAllBucketObjects({
					buckets: buckets.map((item) => item.did),
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

		setSchemaFields(getSchemaResponse.payload.fields)
	}
	
	async function initialize() {
		await Promise.all([dispatch(userGetAllSchemas), dispatch(getAllBuckets(address))])
		if (schemaMetadata.length > 0) {
			setSelectedSchema(schemaMetadata[0].schema.did)
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

	function mapToListFormat() {
		return objectsList
			.reduce((acc: any, item: any) => [...acc, ...item], [])
			.filter((item: any) => item.schemaDid === selectedSchemaDid)
			.map(({ objects }: any) => {
				return Object.keys(objects).reduce((acc, key) => {
					if (key === "schema") return acc

					return {
						...acc,
						[key]: {
							text: objects[key].toString(),
						},
					}
				}, {})
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
