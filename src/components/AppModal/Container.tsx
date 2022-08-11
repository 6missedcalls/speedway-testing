import { useContext } from "react"
import { AppModalContext } from "../../contexts/appModalContext/appModalContext"
import modalContentMap from "../../utils/modalContentMap"
import AppModalComponent from "./Component"

interface AppModalContainerProps {
	getModalParent: () => React.MutableRefObject<null> | null
}

function AppModalContainer({ getModalParent }: AppModalContainerProps) {
	const { modalIsOpen, closeModal, content } = useContext(AppModalContext)

	function renderModalContent() {
		if (!content) return null
		const renderComponent = modalContentMap[content]
		if (typeof renderComponent === "function") {
			return renderComponent()
		}
		return null
	}

	return (
		<AppModalComponent
			constent={content}
			closeModal={closeModal}
			renderModalContent={renderModalContent}
			modalIsOpen={modalIsOpen}
			getModalParent={getModalParent}
		/>
	)
}

export default AppModalContainer
