import { Button } from "@sonr-io/nebula-react"
import LoadingCircleSvg from "../../../../assets/svgs/LoadingCircle"
import EmptyList from "../../../../components/EmptyList"

interface ObjectsEmptyListComponentProps {
	openNewObjectModal: () => void
	loading: boolean
	hasSchema: boolean
	hasBucket: boolean
	goToSchemas: () => void
	goToBuckets: () => void
}

function ObjectsEmptyListComponent({
	openNewObjectModal,
	loading,
	hasSchema,
	hasBucket,
	goToSchemas,
	goToBuckets,
}: ObjectsEmptyListComponentProps) {
	const message = !hasSchema
		? "You need to create a Schema before you can create Objects"
		: !hasBucket
		? "You need to create a Bucket before you can create Objects"
		: "No Objects using this Schema i this Bucket...Yet..."

	const ctaLabel = !hasSchema
		? "Go to Schemas Page"
		: !hasBucket
		? "Go to Buckets page"
		: "Create New Object"

	const ctaOnClick = !hasSchema
		? goToSchemas
		: !hasBucket
		? goToBuckets
		: openNewObjectModal

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
						message={message}
						cta={
							<Button
								styling="text-custom-md font-extrabold px-6 py-4"
								onClick={ctaOnClick}
								label={ctaLabel}
							/>
						}
					/>
				</div>
			)}
		</>
	)
}

export default ObjectsEmptyListComponent
