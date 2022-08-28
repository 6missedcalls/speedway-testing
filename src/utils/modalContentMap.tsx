import ModalCreateBucket from "../pages/Buckets/ModalCreate"
import NewObjectModalContent from "../pages/Objects/components/NewObjectModalContent"
import { NewObjectModalContentContainerProps } from "../pages/Objects/components/NewObjectModalContent/Container"
import NewSchemaModalContent from "../pages/Schemas/components/NewSchemaModalContent"
import {
	MODAL_CONTENT_NEW_BUCKET,
	MODAL_CONTENT_NEW_OBJECT,
	MODAL_CONTENT_NEW_SCHEMA,
} from "./constants"

const modalComponents: Record<
	string,
	(props?: NewObjectModalContentContainerProps) => JSX.Element
> = {
	[MODAL_CONTENT_NEW_SCHEMA]: () => <NewSchemaModalContent />,
	[MODAL_CONTENT_NEW_OBJECT]: (props?: NewObjectModalContentContainerProps) => (
		<NewObjectModalContent
			{...(props as NewObjectModalContentContainerProps)}
		/>
	),
	[MODAL_CONTENT_NEW_BUCKET]: () => <ModalCreateBucket />,
}

export default modalComponents
