import { handlePropertyChangeProps, Iproperty } from "../../../../utils/types"
import SchemaPropertyComponent from "./Component"

interface SchemaPropertyContainerProps {
	handlePropertyChange: ({ index, data }: handlePropertyChangeProps) => void
	property: Iproperty
	propertyIndex: number
	deleteProperty: (index: number) => void
	propertiesLength: number
}

function SchemaPropertyContainer({
	handlePropertyChange,
	property,
	propertyIndex,
	deleteProperty,
	propertiesLength,
}: SchemaPropertyContainerProps) {
	return (
		<SchemaPropertyComponent
			handlePropertyChange={handlePropertyChange}
			property={property}
			propertyIndex={propertyIndex}
			deleteProperty={deleteProperty}
			propertiesLength={propertiesLength}
		/>
	)
}

export default SchemaPropertyContainer
