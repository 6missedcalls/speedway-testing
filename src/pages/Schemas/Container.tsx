import { useContext, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppModalContext } from "../../contexts/appModalContext/appModalContext"
import { selectAddress } from "../../redux/slices/authenticationSlice"
import {
	selectSchemasLoading,
	selectSchemasMetadataList,
	userGetAllSchemas,
} from "../../redux/slices/schemasSlice"
import { AppDispatch } from "../../redux/store"
import { MODAL_CONTENT_NEW_SCHEMA } from "../../utils/constants"
import { IsearchableList, IsearchableListItem, SchemaMeta } from "../../utils/types"
import SchemasPageComponent from "./Component"
import EmptyList from "./components/EmptyList"
import ViewProperties from "./components/ViewProperties"

function SchemasPageContainer() {
	const { setModalContent, openModal } = useContext(AppModalContext)
	const address = useSelector(selectAddress)
	const schemaMetadata = useSelector(selectSchemasMetadataList)
	const dispatch = useDispatch<AppDispatch>()
	const loading = useSelector(selectSchemasLoading)

	useEffect(() => {
		dispatch(userGetAllSchemas(address))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	function openNewSchemaModal() {
		setModalContent({ content: MODAL_CONTENT_NEW_SCHEMA })
		openModal()
	}

	function mapToListFormat(list: Array<SchemaMeta>): IsearchableList {
		return list.map((item: SchemaMeta): IsearchableListItem => {
			const getSchemaPayload = {
				address,
				creator: "",
				schema: item.did,
			}

			return {
				"Schema name": {
					text: item.label,
				},
				DID: {
					text: item.did,
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
			{schemaMetadata && schemaMetadata.length > 0 ? (
				<SchemasPageComponent
					openNewSchemaModal={openNewSchemaModal}
					list={mapToListFormat(schemaMetadata)}
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
