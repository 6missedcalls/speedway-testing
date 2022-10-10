import LoadingCircleSvg from "../../assets/svgs/LoadingCircle"
import LayoutMenu from "../../components/LayoutMenu"
import SearchableList from "../../components/SearchableList"
import { SearchableListType, ListTypes } from "../../utils/types"

interface SchemasPageComponentProps {
	list: SearchableListType
	searchableAndSortableFieldKey: string
	openNewSchemaModal: () => void
	loading: boolean
}

function SchemasPageComponent({
	list,
	searchableAndSortableFieldKey,
	openNewSchemaModal,
	loading,
}: SchemasPageComponentProps) {
	return (
		<LayoutMenu>
			<div className="h-screen font-extrabold w-full bg-gray-100 px-10 pb-10 overflow-auto">
				<h1 className="text-custom-3xl tracking-custom-x2tighter mt-14 mb-8 text-default">
					Schemas
				</h1>
				{loading && (
					<div className="w-full flex justify-center mt-20">
						<div className="w-28 animate-spin flex justify-center items-center">
							<LoadingCircleSvg />
						</div>
					</div>
				)}
				<div className={`${loading ? "hidden" : ""}`}>
					<SearchableList
						searchableAndSortableFieldKey={searchableAndSortableFieldKey}
						handleOpenModal={openNewSchemaModal}
						initialList={list}
						type={ListTypes.schema}
						loading={loading}
					/>
				</div>
			</div>
		</LayoutMenu>
	)
}

export default SchemasPageComponent
