import { Button } from "@sonr-io/nebula-react"
import LoadingCircleSvg from "../../../../assets/svgs/LoadingCircle"
import EmptyList from "../../../../components/EmptyList"

interface ObjectsEmptyListComponentProps {
	openNewObjectModal: () => void
	loading: boolean
	hasSchema: boolean
	goToSchemas: () => void
}

function ObjectsEmptyListComponent({
	openNewObjectModal,
	loading,
	hasSchema,
	goToSchemas,
}: ObjectsEmptyListComponentProps) {
	return (
		<>
			{loading ? (
				<div className="w-full flex justify-center mt-20">
					<div className="w-28 animate-spin flex justify-center items-center">
						<LoadingCircleSvg />
					</div>
				</div>
			) : (
				<div className="flex justify-center items-center w-full">
					<EmptyList
						message={
							!hasSchema
								? "You need to create a Schema before creating Objects"
								: "No Objects using this Schema...Yet..."
						}
						cta={
							!hasSchema ? (
								<Button
									styling="text-custom-md font-extrabold tracking-custom-tight h-12"
									onClick={goToSchemas}
									label="Go to Schemas Page"
								/>
							) : (
								<Button
									styling="text-custom-md font-extrabold tracking-custom-tight h-12"
									onClick={openNewObjectModal}
									iconName="Add"
									iconType="outline"
									label="Create New Object"
								/>
							)
						}
					/>
				</div>
			)}
		</>
	)
}

export default ObjectsEmptyListComponent
