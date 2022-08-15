import NewObjectModalContent from "../pages/Objects/components/NewObjectModalContent"
import NewSchemaModalContent from "../pages/Schemas/components/NewSchemaModalContent"
import { MODAL_CONTENT_NEW_OBJECT, MODAL_CONTENT_NEW_SCHEMA } from "./constants"

const modalComponents: Record<string, () => JSX.Element> = {
	[MODAL_CONTENT_NEW_SCHEMA]: () => <NewSchemaModalContent />,
	[MODAL_CONTENT_NEW_OBJECT]: () => <NewObjectModalContent />,
}

export default modalComponents
