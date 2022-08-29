import { IsearchableListItem } from "../../../utils/types"

interface ObjectHeadersProps {
	list: Array<IsearchableListItem>
}

function ObjectHeaders({ list }: ObjectHeadersProps) {
	const keys = Object.keys(list[0] ? list[0] : [])

	return (
		<>
			{keys.map((key: string, index: number) => {
				return (
					<th className="px-4" key={`list-header-${key}-${index}`}>
						{key}
					</th>
				)
			})}
		</>
	)
}

export default ObjectHeaders
