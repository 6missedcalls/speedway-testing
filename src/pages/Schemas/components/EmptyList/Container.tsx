import LoadingCircleSvg from "../../../../assets/svgs/LoadingCircle"
import EmptyListComponent from "./Component"

interface EmptyListContainerProps {
	openNewSchemaModal: () => void
	getSchemaLoading: boolean
}

function EmptyListContainer({
	openNewSchemaModal,
	getSchemaLoading,
}: EmptyListContainerProps) {
	return (
		<>
			{getSchemaLoading ? (
				<div className="w-full flex justify-center mt-20">
					<div className="w-28 animate-reverse-spin flex justify-center items-center">
						<LoadingCircleSvg />
					</div>
				</div>
			) : (
				<EmptyListComponent openNewSchemaModal={openNewSchemaModal} />
			)}
		</>
	)
}

export default EmptyListContainer
