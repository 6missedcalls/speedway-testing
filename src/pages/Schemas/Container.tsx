import { useContext } from "react"
import { AppModalContext } from "../../contexts/appModalContext/appModalContext"
import { MODAL_CONTENT_NEW_SCHEMA } from "../../utils/constants"
import SchemasPageComponent from "./Component"
import mockSchemaList from "./fixtures/mockSchemaList"

function SchemasPageContainer() {
	const { setModalContent, openModal } = useContext(AppModalContext)
	const list = mockSchemaList

	function openNewSchemaModal() {
		setModalContent(MODAL_CONTENT_NEW_SCHEMA)
		openModal()
	}

	return (
		<SchemasPageComponent openNewSchemaModal={openNewSchemaModal} list={list} />
	)
}

export default SchemasPageContainer
