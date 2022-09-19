import Modal from "react-modal"

Modal.setAppElement("#root")

interface AppModalComponentProps {
	modalIsOpen: boolean
	closeModal: () => void
	renderModalContent: () => JSX.Element | null
}

function AppModalComponent({
	modalIsOpen,
	closeModal,
	renderModalContent,
}: AppModalComponentProps) {
	return (
		<div>
			<Modal
				onRequestClose={closeModal}
				isOpen={modalIsOpen}
				contentLabel="Example Modal"
				overlayClassName="absolute backdrop-blur-lg h-screen inset-0 bg-gray-900-transparent z-10"
				className="absolute shadow-xxl rounded-2xl left-1/2 bg-white w-8/12 top-1/2 -translate-y-1/2 -translate-x-1/2"
			>
				{renderModalContent()}
			</Modal>
		</div>
	)
}

export default AppModalComponent
