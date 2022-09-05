import LayoutMenu from "../../components/LayoutMenu"
import SearchableList from "../../components/SearchableList"
import { NebulaIcon } from "@sonr-io/nebula-react"
import EmptyList from "./components/EmptyList"
import { listTypes, IsearchableListItem, SchemaMeta } from "../../utils/types"
import LoadingCircleSvg from "../../assets/svgs/LoadingCircle"

interface ObjectsPageComponentProps {
	schemas: Array<SchemaMeta>
	selectedSchemaDid: string
	setSelectedSchema: React.Dispatch<React.SetStateAction<string>>
	openNewObjectModal: () => void
	loading: boolean
	schemaCount: number
	bucketCount: number
	list: Array<IsearchableListItem>
}

const ObjectsPageComponent = ({
	schemas,
	selectedSchemaDid,
	setSelectedSchema,
	openNewObjectModal,
	loading,
	list,
	schemaCount,
	bucketCount,
}: ObjectsPageComponentProps) => {
	return (
		<LayoutMenu>
			<div className="h-screen font-extrabold w-full bg-gray-100 px-10 pb-10 overflow-auto">
				<div className="flex justify-between items-center mt-14 mb-8">
					<h1 className="text-custom-3xl tracking-custom-x2tighter text-default">
						Objects
					</h1>
					{schemaCount > 0 && (
						<div className="flex w-3/12 flex-col items-start justify-center">
							<div className="mb-2">Schemas</div>
							<div className="relative pointer-events-none select-none border border-default-border rounded-md w-full cursor-pointer flex justify-between">
								<select
									className="appearance-none py-2 px-3 rounded-md pointer-events-auto cursor-pointer w-full"
									onChange={(event) => setSelectedSchema(event.target.value)}
									value={selectedSchemaDid}
								>
									{schemas.map((item) => (
										<option key={item.did} value={item.did}>
											{item.label}
										</option>
									))}
								</select>
								<NebulaIcon
									iconName="ArrowSquareDown"
									iconType="duotone"
									className="w-8 h-8 pointer-events-none select-none absolute right-0 top-1"
								/>
							</div>
						</div>
					)}
				</div>
				{loading && (
					<div className="w-full flex justify-center mt-20">
						<div className="w-28 animate-spin flex justify-center items-center">
							<LoadingCircleSvg />
						</div>
					</div>
				)}
				<div className={`${loading ? "hidden" : ""}`}>
					{list.length > 0 ? (
						<SearchableList
							handleOpenModal={openNewObjectModal}
							initialList={list}
							type={listTypes.object}
							loading={loading}
						/>
					) : (
						<EmptyList
							openNewObjectModal={openNewObjectModal}
							loading={loading}
							schemaCount={schemaCount}
							bucketCount={bucketCount}
						/>
					)}
				</div>
			</div>
		</LayoutMenu>
	)
}

export default ObjectsPageComponent
