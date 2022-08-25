import { useContext, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppModalContext } from "../../contexts/appModalContext/appModalContext"
import { selectAddress } from "../../redux/slices/authenticationSlice"
import {
	selectSchemasLoading,
	selectSchemasMetaDataList,
	userGetAllSchemas,
} from "../../redux/slices/schemasSlice"
import { MODAL_CONTENT_NEW_SCHEMA } from "../../utils/constants"
import { addressToDid } from "../../utils/did"
import { obfuscateDid } from "../../utils/string"
import {
	Ischema,
	IsearchableListItem,
	IsearchableListItemData,
} from "../../utils/types"
import SchemasPageComponent from "./Component"
import EmptyList from "./components/EmptyList"
import ViewProperties from "./components/ViewProperties"

function SchemasPageContainer() {
	const { setModalContent, openModal } = useContext(AppModalContext)
	const address = useSelector(selectAddress)
	const allMetaData = useSelector(selectSchemasMetaDataList)
	const accountMetaData = allMetaData.filter(
		(schema) => schema.creator === addressToDid(address)
	)
	const dispatch = useDispatch<any>()
	const loading = useSelector(selectSchemasLoading)

	useEffect(() => {
		dispatch(userGetAllSchemas())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	function openNewSchemaModal() {
		setModalContent({ content: MODAL_CONTENT_NEW_SCHEMA })
		openModal()
	}

	function mapToListFormat(list: Array<Ischema>) {
		return list.map((item: Ischema) => {
			const getSchemaPayload = {
				address,
				creator: item.creator,
				schema: item.did,
			}

			return {
				"Schema name": {
					text: item.schema.label,
				},
				DID: {
					text: obfuscateDid(item.did),
				},
				Fields: {
					Component: ViewProperties,
					props: {
						getSchemaPayload,
						key: item.did,
					},
				},
			}
		})
	}

	return (
		<>
			{accountMetaData && accountMetaData.length > 0 ? (
				<SchemasPageComponent
					openNewSchemaModal={openNewSchemaModal}
					list={mapToListFormat(accountMetaData) as Array<IsearchableListItem>}
					searchableAndSortableFieldKey="Schema name"
					loading={loading}
				/>
			) : (
				<EmptyList openNewSchemaModal={openNewSchemaModal} loading={loading} />
			)}
		</>
	)
}

export default SchemasPageContainer
