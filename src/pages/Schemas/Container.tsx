/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppModalContext } from "../../contexts/appModalContext/appModalContext"
import { selectAddress } from "../../redux/slices/authenticationSlice"
import {
	selectSchemasMetaDataList,
	userGetAllSchemas,
} from "../../redux/slices/schemasSlice"
import { MODAL_CONTENT_NEW_SCHEMA } from "../../utils/constants"
import { obfuscateDid } from "../../utils/string"
import { Ischema } from "../../utils/types"
import SchemasPageComponent from "./Component"
import ViewProperties from "./components/ViewProperties"

function SchemasPageContainer() {
	const { setModalContent, openModal } = useContext(AppModalContext)
	const address = useSelector(selectAddress)
	const schemasMetaDataList = useSelector(selectSchemasMetaDataList)
	const dispatch = useDispatch<any>()

	useEffect(() => {
		dispatch(userGetAllSchemas())
	}, [])

	function openNewSchemaModal() {
		setModalContent(MODAL_CONTENT_NEW_SCHEMA)
		openModal()
	}

	function mapToListFormat(list: any) {
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
		<SchemasPageComponent
			openNewSchemaModal={openNewSchemaModal}
			list={mapToListFormat(schemasMetaDataList)}
			searchableAndSortableFieldKey="Schema name"
		/>
	)
}

export default SchemasPageContainer
