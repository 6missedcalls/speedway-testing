import LayoutMenu from "../../../../components/LayoutMenu"
import { Button, NebulaIcon } from "@sonr-io/nebula-react"

interface EmptyListComponentProps {
	openNewSchemaModal: () => void
}

function EmptyListComponent({ openNewSchemaModal }: EmptyListComponentProps) {
	return (
		<LayoutMenu>
			<div className="h-screen w-full bg-gray-100 px-10 pb-10 overflow-auto">
				<h1 className="text-custom-3xl font-extrabold tracking-custom-x2tighter mt-14 mb-8">
					Schemas
				</h1>
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
								No Schemas to Display
							</span>
						</div>
						<Button
							styling="text-custom-md font-extrabold tracking-custom-tight h-12"
							onClick={openNewSchemaModal}
							iconName="Add"
							iconType="outline"
							label="Create New Schema"
						/>
					</div>
				</div>
			</div>
		</LayoutMenu>
	)
}

export default EmptyListComponent
