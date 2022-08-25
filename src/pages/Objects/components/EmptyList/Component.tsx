import { Button, NebulaIcon } from "@sonr-io/nebula-react"
import LoadingCircleSvg from "../../../../assets/svgs/LoadingCircle"

interface ObjectsEmptyListComponentProps {
	openNewObjectModal: () => void
	loading: boolean
	schemasCount: number
	goToSchemas: () => void
}

function ObjectsEmptyListComponent({
	openNewObjectModal,
	loading,
	schemasCount,
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
					<div className="flex flex-col justify-center items-center border border-[#DEDDE4] px-16 py-10 rounded-2xl mt-24">
						<div className="flex justify-center items-center w-24 h-24 shadow-xxl bg-white rounded-2xl border-white border-2 mb-6">
							<div className="flex justify-center items-center">
								<NebulaIcon
									className="w-12 h-12 cursor-pointer"
									iconName="MessageQuestion"
									iconType="duotone"
								/>
							</div>
						</div>
						<div className="mb-10">
							<span className="block text-custom-lg font-extrabold text-subdued">
								{schemasCount === 0
									? "You need to create a Schema before creating Objects"
									: "No Objects using this Schema...Yet..."}
							</span>
						</div>
						{schemasCount === 0 ? (
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
						)}
					</div>
				</div>
			)}
		</>
	)
}

export default ObjectsEmptyListComponent
