import LayoutMenu from "../../components/LayoutMenu"
import SearchableList from "../../components/SearchableList"
import { listTypes } from "../../utils/types"

interface SchemasPageComponentProps {
	list: any
	searchableAndSortableFieldKey: string
	openNewSchemaModal: () => void
}

function SchemasPageComponent({
	list,
	searchableAndSortableFieldKey,
	openNewSchemaModal,
}: SchemasPageComponentProps) {
	return (
		<LayoutMenu>
			<div className="h-screen font-extrabold w-full bg-gray-100 px-10 pb-10 overflow-auto">
				<h1 className="text-custom-3xl tracking-custom-x2tighter mt-14 mb-8">
					Schemas
				</h1>
				<SearchableList
					searchableAndSortableFieldKey={searchableAndSortableFieldKey}
					handleOpenModal={openNewSchemaModal}
					initialList={list}
					type={listTypes.schema}
				/>
			</div>
		</LayoutMenu>
	)
}

export default SchemasPageComponent
