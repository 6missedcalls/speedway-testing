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
	userGetSchema,
} from "../../redux/slices/schemasSlice"
import { MODAL_CONTENT_NEW_OBJECT } from "../../utils/constants"
import { parseFileValueFromByteArrayAndDownload } from "../../utils/files"
import {
	SearchableList,
	SearchableListItem,
	SonrObject,
	SchemaField,
} from "../../utils/types"
import ObjectsPageComponent from "./Component"
const Buffer = require('buffer/').Buffer

function ObjectsPageContainer() {
	const { setModalContent, openModal } = useContext(AppModalContext)
	const dispatch: Function = useDispatch()
	const buckets = useSelector(selectBuckets)
	const [selectedSchemaDid, setSelectedSchema] = useState("")
	const [selectedBucket, setSelectedBucket] = useState(buckets[0]?.did)
	const [schemaFields, setSchemaFields] = useState<SchemaField[]>([])
	const objectsList = useSelector(selectObjectsList)
	const schemasLoading = useSelector(selectSchemasLoading)
	const bucketsLoading = useSelector(selectBucketsLoading)
	const objectsLoading = useSelector(selectObjectsLoading)
	const address = useSelector(selectAddress)
	const schemaMetadata = useSelector(selectSchemasMetadataList)
	const loading = schemasLoading || objectsLoading || bucketsLoading

	useEffect(() => {
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
		if (selectedSchemaDid && selectedBucket) {
			getSchema()
			setModalContent({
				content: MODAL_CONTENT_NEW_OBJECT,
				props: {
					selectedSchemaDid,
					setSelectedSchema,
					selectedBucket,
					setSelectedBucket,
					initialSchemaFields: schemaFields,
					schemas: schemaMetadata,
				},
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSchemaDid, selectedBucket])

	async function getSchema() {
		const selectedSchemaData = schemaMetadata.find(
			(item) => item.did === selectedSchemaDid
		)!
		const getSchemaPayload = {
			address,
			creator: "",
			schema: selectedSchemaData.did,
		}

		const schemaFields = await dispatch(
			userGetSchema({ schema: getSchemaPayload })
		)

		setSchemaFields(schemaFields.payload)
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
				selectedBucket,
				setSelectedBucket,
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
					if(data[key]?.buffer?.type === 'Buffer'){
						const item = data[key].buffer
						const arr = new Uint8Array(item.data as ArrayBuffer)
            			const buffer = Buffer.from(arr)
						listItem[key] = { 
							text: '',
							Component: () => (
								<div
									className="w-20 h-8 bg-button-subtle rounded cursor-pointer flex justify-center items-center"
									onClick={() => parseFileValueFromByteArrayAndDownload(buffer as ArrayBuffer, data[key].fileName)}
								>
									<span className="block font-extrabold text-custom-xs text-button-subtle">
										Download
									</span>
								</div>
							)
						}	
					} else {
						listItem[key] = { 
							text: data[key].toString() 
						}
					}
				})
				return listItem
			})
	}

	return (
		<ObjectsPageComponent
			schemas={schemaMetadata}
			buckets={buckets}
			selectedSchemaDid={selectedSchemaDid}
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
