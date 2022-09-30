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
	userGetBucketObjects,
} from "../../redux/slices/objectsSlice"
import {
	selectSchemasLoading,
	selectSchemasMetadataList,
	userGetAllSchemas,
} from "../../redux/slices/schemasSlice"
import { MODAL_CONTENT_NEW_OBJECT } from "../../utils/constants"
import {
	SearchableList,
	SearchableListItem,
	SonrObject,
} from "../../utils/types"
import ObjectsPageComponent from "./Component"

function ObjectsPageContainer() {
	const { setModalContent, openModal } = useContext(AppModalContext)
	const dispatch: Function = useDispatch()
	const buckets = useSelector(selectBuckets)
	const schemaMetadata = useSelector(selectSchemasMetadataList)
	const [selectedSchema, setSelectedSchema] = useState(schemaMetadata[0]?.did || "")
	const [selectedBucket, setSelectedBucket] = useState(buckets[0]?.did || "")
	const objectsList = useSelector(selectObjectsList)
	const schemasLoading = useSelector(selectSchemasLoading)
	const bucketsLoading = useSelector(selectBucketsLoading)
	const objectsLoading = useSelector(selectObjectsLoading)
	const address = useSelector(selectAddress)
	const loading = schemasLoading || objectsLoading || bucketsLoading

	useEffect(() => {
		async function initialize() {
			const [schemas, buckets] = await Promise.all([
				dispatch(userGetAllSchemas(address)),
				dispatch(userGetAllBuckets(address)),
			])
			
			if (!schemaMetadata && schemas.payload.length > 0) {
				setSelectedSchema(schemas.payload[0])
			}

			if(!selectedBucket && buckets.payload.length > 0){
				setSelectedBucket(buckets.payload[0])
			}

		}
		initialize()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (selectedBucket) {
			dispatch(
				userGetBucketObjects({
					bucketDid: selectedBucket,
				})
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBucket])

	useEffect(() => {
		if (selectedSchema && selectedBucket) {
			setModalContent({
				content: MODAL_CONTENT_NEW_OBJECT,
				props: {
					selectedSchema,
					selectedBucket,
					onChangeSchema: setSelectedSchema,
					onChangeBucket: setSelectedBucket,
					schemas: schemaMetadata,
				},
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSchema, selectedBucket])

	function openNewObjectModal() {
		setModalContent({
			content: MODAL_CONTENT_NEW_OBJECT,
			props: {
				selectedSchema,
				selectedBucket,
				onChangeSchema: setSelectedSchema,
				onChangeBucket: setSelectedBucket,
				schemas: schemaMetadata,
			},
		})
		openModal()
	}

	function mapToListFormat(): SearchableList {
		return objectsList
			.filter((item: SonrObject) => item.schemaDid === selectedSchema)
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
			buckets={buckets}
			selectedSchema={selectedSchema}
			selectedBucket={selectedBucket}
			setSelectedBucket={setSelectedBucket}
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
