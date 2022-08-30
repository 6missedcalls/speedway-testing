import { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppModalContext } from "../../contexts/appModalContext/appModalContext"
import { selectAddress } from "../../redux/slices/authenticationSlice"
import { getAllBuckets, selectBuckets } from "../../redux/slices/bucketSlice"
import {
	selectObjectsList,
	selectObjectsLoading,
	userGetBucketObjects,
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
	const objectsLoading = useSelector(selectObjectsLoading)
	const buckets = useSelector(selectBuckets)
	const address = useSelector(selectAddress)
	const schemaMetadata = useSelector(selectSchemasMetadataList)
	const loading = schemasLoading && objectsLoading

	useEffect(() => {
		initialize()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (buckets.length > 0) {
			buckets.forEach(({ did }) => {
				dispatch(userGetBucketObjects({ bucket: did }))
			})
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
		await Promise.all([dispatch(userGetAllSchemas), dispatch(getAllBuckets)])
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
		const objectsBySchema = objectsList.filter(
			(obj) => obj.schema === selectedSchemaDid
		)

		return objectsBySchema.map((object) => {
			return Object.keys(object).reduce((acc, key) => {
				return {
					...acc,
					[key]: {
						text: object[key],
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
