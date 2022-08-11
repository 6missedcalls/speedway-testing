import SchemaPropertyComponent from "./Component"

interface SchemaPropertyContainerProps {
	handlePropertyChange: any
	property: any
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
