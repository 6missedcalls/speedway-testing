import { ItypeSchemaMap, typeSchemaMap } from "../../../../utils/mappings"
import { IpropertyResponse } from "../../../../utils/types"

interface ViewPropertiesComponentProps {
	properties: Array<IpropertyResponse>
	onClick: () => void
}

function ViewPropertiesComponent({
	properties = [],
	onClick,
}: ViewPropertiesComponentProps) {
	return (
		<div>
			<div onClick={onClick}>View</div>
			<div>
				{properties.map((property) => (
					<div key={`${property.name}`}>
						<div>{property.name}</div>
						<div>{typeSchemaMap[property.field as keyof ItypeSchemaMap]}</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default ViewPropertiesComponent
