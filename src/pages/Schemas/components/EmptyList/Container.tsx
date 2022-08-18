import EmptyListComponent from "./Component"

interface EmptyListContainerProps {
	openNewSchemaModal: () => void
}

function EmptyListContainer({ openNewSchemaModal }: EmptyListContainerProps) {
	return <EmptyListComponent openNewSchemaModal={openNewSchemaModal} />
}

export default EmptyListContainer
