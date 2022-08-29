import { useNavigate } from "react-router-dom"
import { ROUTE_BUCKETS, ROUTE_SCHEMAS } from "../../../../utils/constants"
import ObjectsEmptyListComponent from "./Component"

interface EmptyListContainerProps {
	openNewObjectModal: () => void
	loading: boolean
	schemaCount: number
	bucketCount: number
}

function ObjectsEmptyListContainer({
	openNewObjectModal,
	loading,
	schemaCount,
	bucketCount,
}: EmptyListContainerProps) {
	const navigate = useNavigate()

	function goToSchemas() {
		navigate(ROUTE_SCHEMAS)
	}

	function goToBuckets() {
		navigate(ROUTE_BUCKETS)
	}

	return (
		<ObjectsEmptyListComponent
			goToSchemas={goToSchemas}
			goToBuckets={goToBuckets}
			hasSchema={schemaCount > 0}
			hasBucket={bucketCount > 0}
			openNewObjectModal={openNewObjectModal}
			loading={loading}
		/>
	)
}

export default ObjectsEmptyListContainer
