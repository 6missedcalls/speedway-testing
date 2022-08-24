import LayoutMenu from "../../components/LayoutMenu"
import SearchableList from "../../components/SearchableList"
import { NebulaIcon } from "@sonr-io/nebula-react"
import EmptyList from "./components/EmptyList"

interface ObjectsPageComponentProps {
	schemas: Array<any>
	selectedSchemaDid: string
	setSelectedSchema: React.Dispatch<React.SetStateAction<string>>
	schemaHasObjects: boolean
	openNewObjectModal: () => void
	loading: boolean
	schemasCount: number
}

const ObjectsPageComponent = ({
	schemas,
	selectedSchemaDid,
	setSelectedSchema,
	schemaHasObjects,
	openNewObjectModal,
	loading,
	schemasCount
}: ObjectsPageComponentProps) => {
	return (
		<LayoutMenu>
			<div className="h-screen font-extrabold w-full bg-gray-100 px-10 pb-10 overflow-auto">
				<div className="flex justify-between items-center mt-14 mb-8">
					<h1 className="text-custom-3xl tracking-custom-x2tighter">Objects</h1>
					<div className="relative pointer-events-none select-none border border-default-border rounded-md w-3/12 ml-2 cursor-pointer flex justify-between">
						<select
							className="appearance-none py-2 px-3 rounded-md pointer-events-auto cursor-pointer w-full"
							onChange={(event) => setSelectedSchema(event.target.value)}
							value={selectedSchemaDid}
						>
							{schemas.map((item) => (
								<option value={item.schema.did}>{item.schema.label}</option>
							))}
						</select>
						<NebulaIcon
							iconName="ArrowSquareDown"
							iconType="duotone"
							className="w-8 h-8 pointer-events-none select-none absolute right-0 top-1"
						/>
					</div>
				</div>
				<div>
					{schemaHasObjects ?  (
						<div>List Here</div>
					) : (
						<EmptyList
							openNewObjectModal={openNewObjectModal}
							loading={loading}
							schemasCount={schemasCount}
						/>
					)}
				</div>
			</div>
		</LayoutMenu>
	)
}

export default ObjectsPageComponent
