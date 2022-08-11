import { handlePropertyChangeProps, Iproperty } from "../../../../utils/types"
import SchemaPropertyComponent from "./Component"

interface SchemaPropertyContainerProps {
	handlePropertyChange: ({ index, data }: handlePropertyChangeProps) => void
	property: Iproperty
	propertyIndex: number
}

function SchemaPropertyContainer({
	handlePropertyChange,
	property,
	propertyIndex,
}: SchemaPropertyContainerProps) {
	return (
		<SchemaPropertyComponent
			handlePropertyChange={handlePropertyChange}
			property={property}
			propertyIndex={propertyIndex}
		/>
	)
}

export default SchemaPropertyContainer
