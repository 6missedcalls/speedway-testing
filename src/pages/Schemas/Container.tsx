import { useContext, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppModalContext } from "../../contexts/appModalContext/appModalContext"
import {
	selectSchemasMetaDataList,
	userGetAllSchemas,
} from "../../redux/slices/schemasSlice"
import { MODAL_CONTENT_NEW_SCHEMA } from "../../utils/constants"
import SchemasPageComponent from "./Component"

function SchemasPageContainer() {
	const { setModalContent, openModal } = useContext(AppModalContext)
	const schemasMetaDataList = useSelector(selectSchemasMetaDataList)
	const dispatch = useDispatch<any>()

	useEffect(() => {
		dispatch(userGetAllSchemas())
	}, [])

	function openNewSchemaModal() {
		setModalContent(MODAL_CONTENT_NEW_SCHEMA)
		openModal()
	}

	return (
		<SchemasPageComponent
			openNewSchemaModal={openNewSchemaModal}
			list={schemasMetaDataList}
		/>
	)
}

export default SchemasPageContainer
