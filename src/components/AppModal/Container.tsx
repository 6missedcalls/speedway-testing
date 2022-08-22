import { useContext } from "react"
import { AppModalContext } from "../../contexts/appModalContext/appModalContext"
import modalContentMap from "../../utils/modalContentMap"
import AppModalComponent from "./Component"

interface AppModalContainerProps {
	getModalParent: () => HTMLElement
}

function AppModalContainer({ getModalParent }: AppModalContainerProps) {
	const { modalIsOpen, closeModal, content, props } = useContext(AppModalContext)

	function renderModalContent() {
		if (!content) return null
		const renderComponent = modalContentMap[content]
		if (typeof renderComponent === "function") {
			return renderComponent(props)
		}
		return null
	}

	return (
		<AppModalComponent
			closeModal={closeModal}
			renderModalContent={renderModalContent}
			modalIsOpen={modalIsOpen}
			getModalParent={getModalParent}
		/>
	)
}

export default AppModalContainer
