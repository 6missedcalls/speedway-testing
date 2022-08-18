import EmptyListComponent from "./Component"

interface EmptyListContainerProps {
	openNewSchemaModal: () => void
	loading: boolean
}

function EmptyListContainer({
	openNewSchemaModal,
	loading,
}: EmptyListContainerProps) {
	return (
		<EmptyListComponent
			openNewSchemaModal={openNewSchemaModal}
			loading={loading}
		/>
	)
}

export default EmptyListContainer
