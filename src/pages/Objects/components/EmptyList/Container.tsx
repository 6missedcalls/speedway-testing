import { useNavigate } from "react-router-dom"
import { ROUTE_SCHEMAS } from "../../../../utils/constants"
import ObjectsEmptyListComponent from "./Component"

interface EmptyListContainerProps {
	openNewObjectModal: () => void
	loading: boolean
	schemasCount: number
}

function ObjectsEmptyListContainer({
	openNewObjectModal,
	loading,
	schemasCount,
}: EmptyListContainerProps) {
	const navigate = useNavigate()

	function goToSchemas() {
		navigate(ROUTE_SCHEMAS)
	}

	return (
		<ObjectsEmptyListComponent
			goToSchemas={goToSchemas}
			hasSchema={schemasCount > 0}
			openNewObjectModal={openNewObjectModal}
			loading={loading}
		/>
	)
}

export default ObjectsEmptyListContainer
