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
import { downloadFileFromBase64 } from "../../utils/files"
import { parseJsonFromBase64String } from "../../utils/object"
import {
	SearchableList,
	SearchableListItem,
	SonrObject,
} from "../../utils/types"
import ObjectsPageComponent from "./Component"
const Buffer = require("buffer/").Buffer

function ObjectsPageContainer() {
	const { setModalContent, openModal } = useContext(AppModalContext)
	const dispatch: Function = useDispatch()
	const buckets = useSelector(selectBuckets)
	const [selectedSchema, setSelectedSchema] = useState("")
	const [selectedBucket, setSelectedBucket] = useState(buckets[0]?.did)
	const objectsList = useSelector(selectObjectsList)
	const schemasLoading = useSelector(selectSchemasLoading)
	const bucketsLoading = useSelector(selectBucketsLoading)
	const objectsLoading = useSelector(selectObjectsLoading)
	const address = useSelector(selectAddress)
	const schemaMetadata = useSelector(selectSchemasMetadataList)
	const loading = schemasLoading || objectsLoading || bucketsLoading

	useEffect(() => {
		async function initialize() {
			await Promise.all([
				dispatch(userGetAllSchemas),
				dispatch(userGetAllBuckets(address)),
			])
			if (schemaMetadata.length > 0) {
				setSelectedSchema(schemaMetadata[0].did)
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
					if (data[key]?.["/"]?.bytes) {
						const item = data[key]["/"].bytes
						const parsedData = parseJsonFromBase64String(item)
						const { base64File, fileName } = parsedData
						listItem[key] = {
							text: "",
							Component: () => (
								<div
									className="w-20 h-8 bg-button-subtle rounded cursor-pointer flex justify-center items-center"
									onClick={() => downloadFileFromBase64(base64File, fileName)}
								>
									<span className="block font-extrabold text-custom-xs text-button-subtle">
										Download
									</span>
								</div>
							),
						}
					} else {
						listItem[key] = {
							text: data[key].toString(),
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
