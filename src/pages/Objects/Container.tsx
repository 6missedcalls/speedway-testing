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
	selectSchemasMetaDataList,
	userGetAllSchemas,
	userGetSchema,
} from "../../redux/slices/schemasSlice"
import { AppDispatch } from "../../redux/store"
import { MODAL_CONTENT_NEW_OBJECT } from "../../utils/constants"
import { addressToDid } from "../../utils/did"
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
	const allMetaData = useSelector(selectSchemasMetaDataList)
	const accountMetaData = allMetaData.filter(
		(schema) => schema.creator === addressToDid(address)
	)
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
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedSchemaDid])

	async function getSchema() {
		const selectedSchemaData = accountMetaData.find(
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
		if (accountMetaData.length > 0) {
			setSelectedSchema(accountMetaData[0].schema.did)
		}
	}

	function openNewObjectModal() {
		setModalContent({
			content: MODAL_CONTENT_NEW_OBJECT,
			props: {
				initialSelectedSchema: selectedSchemaDid,
				initialSchemaFields: schemaFields,
				schemas: accountMetaData,
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
			schemas={accountMetaData}
			selectedSchemaDid={selectedSchemaDid}
			setSelectedSchema={setSelectedSchema}
			openNewObjectModal={openNewObjectModal}
			loading={loading}
			list={mapToListFormat()}
			schemasCount={accountMetaData.length}
		/>
	)
}

export default ObjectsPageContainer
