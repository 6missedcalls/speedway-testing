import { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppModalContext } from "../../contexts/appModalContext/appModalContext"
import { selectAddress } from "../../redux/slices/authenticationSlice"
import { selectObjectsLoading } from "../../redux/slices/objectsSlice"
import { selectSchemasLoading, selectSchemasMetaDataList, userGetAllSchemas, userGetSchema } from "../../redux/slices/schemasSlice"
import { getSchema } from "../../service/schemas"
import { MODAL_CONTENT_NEW_OBJECT } from "../../utils/constants"
import { addressToDid } from "../../utils/did"
import { obfuscateDid } from "../../utils/string"
import ObjectsPageComponent from "./Component"
import EmptyList from "./components/EmptyList"

function ObjectsPageContainer() {
	const { setModalContent, openModal } = useContext(AppModalContext)
	const dispatch = useDispatch<any>()
	const [selectedSchema, setSelectedSchema] = useState("")
	const [objectsList, setObjectsList] = useState([])
	const [schemaFields, setSchemaFields] = useState("")
	const schemasLoading = useSelector(selectSchemasLoading)
	const objectsLoading = useSelector(selectObjectsLoading)
	
	const address = useSelector(selectAddress)
	const allMetaData = useSelector(selectSchemasMetaDataList)
	const accountMetaData = allMetaData.filter(
		(schema) => schema.creator === addressToDid(address)
	)
	const loading = schemasLoading && objectsLoading

	useEffect(() => {
		getSchemasAndSelectDefault()
	}, [])

	useEffect(() => {
		if(selectedSchema){
			getSchema()
		}
	}, [selectedSchema])

	async function getSchema(){
		const selectedSchemaData = accountMetaData.find((item) => item.schema.did === selectedSchema)!
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

	async function getSchemasAndSelectDefault(){
		await dispatch(userGetAllSchemas())
		if(accountMetaData.length > 0)
		setSelectedSchema(accountMetaData[0].schema.did)
	}

	function openNewObjectModal() {
		setModalContent({ 
			content: MODAL_CONTENT_NEW_OBJECT, 
			props: {
				initialSelectedSchema: selectedSchema,
				initialSchemaFields: schemaFields,
				schemas: accountMetaData
			} 
		})
		openModal()
	}

	function mapToListFormat(list: any) {
		return list.map((item: any) => {
			return {
				"Schema name": {
					text: item.schema.label,
				},
				DID: {
					text: obfuscateDid(item.did),
				},
			}
		})
	}

	return (
		<>
			{objectsList.length > 0 ? (
				<ObjectsPageComponent 
					schemas={accountMetaData}
					selectedSchema={selectedSchema}
					setSelectedSchema={setSelectedSchema}
				/>
			) : (
				<EmptyList 
					openNewObjectModal={openNewObjectModal} 
					loading={loading} 
					schemasCount={accountMetaData.length}
				/>
			)}
		</>
	)
}

export default ObjectsPageContainer
