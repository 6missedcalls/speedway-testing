import LayoutMenu from "../../../../components/LayoutMenu"
import { Button } from "@sonr-io/nebula-react"
import LoadingCircleSvg from "../../../../assets/svgs/LoadingCircle"
import EmptyList from "../../../../components/EmptyList"

interface EmptyListComponentProps {
	openNewSchemaModal: () => void
	loading: boolean
}

function EmptyListComponent({
	openNewSchemaModal,
	loading,
}: EmptyListComponentProps) {
	return (
		<LayoutMenu>
			<div className="h-screen w-full bg-gray-100 px-10 pb-10 overflow-auto">
				<h1 className="text-custom-3xl font-extrabold tracking-custom-x2tighter mt-14 mb-8 text-default">
					Schemas
				</h1>

				{loading && (
					<div className="w-full flex justify-center mt-20">
						<div className="w-28 animate-spin flex justify-center items-center">
							<LoadingCircleSvg />
						</div>
					</div>
				)}

				{!loading && (
					<EmptyList
						message="No Schemas to Display"
						cta={
							<Button
								styling="text-custom-md font-extrabold tracking-custom-tight px-6 py-1.5 h-auto"
								onClick={openNewSchemaModal}
								iconName="Add"
								iconType="outline"
								label="Create New Schema"
							/>
						}
					/>
				)}
			</div>
		</LayoutMenu>
	)
}

export default EmptyListComponent
