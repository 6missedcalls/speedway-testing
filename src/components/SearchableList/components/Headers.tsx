import { ListTypes, SearchableListItem } from "../../../utils/types"
import ObjectHeaders from "./ObjectsHeader"
import SchemaHeaders from "./SchemaHeaders"

interface HeadersProps {
	type: ListTypes
	list: Array<SearchableListItem>
	orderAsc: boolean
	toggleOrder: () => void
}

function Headers({ type, list, toggleOrder, orderAsc }: HeadersProps) {
	switch (type) {
		case ListTypes.schema:
			return SchemaHeaders({ toggleOrder, orderAsc })
		case ListTypes.object:
			return ObjectHeaders({ list })
		default:
			return null
	}
}

export default Headers
