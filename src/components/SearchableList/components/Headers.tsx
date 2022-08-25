import { listTypes, IsearchableListItem } from "../../../utils/types"
import ObjectHeaders from "./ObjectsHeader"
import SchemaHeaders from "./SchemaHeaders"

interface HeadersProps {
	type: listTypes
	list: Array<IsearchableListItem>
	orderAsc: boolean
	toggleOrder: () => void
}

function Headers({ type, list, toggleOrder, orderAsc }: HeadersProps) {
	switch (type) {
		case listTypes.schema:
			return SchemaHeaders({ toggleOrder, orderAsc })
		case listTypes.object:
			return ObjectHeaders({ list })
		default:
			return null
	}
}

export default Headers
