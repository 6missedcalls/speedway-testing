import SchemaPropertyLine from "../SchemaPropertyLine"

interface NewSchemaModalContentComponentProps {
	closeModal: () => void
	properties: Array<any>
	handlePropertyChange: any
	addProperty: any
}

function NewSchemaModalContentComponent({
	closeModal,
	properties,
	handlePropertyChange,
	addProperty,
}: NewSchemaModalContentComponentProps) {
	return (
		<div className="flex flex-col p-4">
			<div className="flex justify-between">
				<div>New Schema</div>
				<div onClick={closeModal}>Cancel</div>
			</div>
			<div>
				<input type="text" placeholder="SchemaName" />
			</div>
			{properties?.length > 0 &&
				properties.map((property, index) => {
					return (
						<SchemaPropertyLine
							key={`schema-property-${index}`}
							propertyIndex={index}
							handlePropertyChange={handlePropertyChange}
							property={property}
						/>
					)
				})}
			<div onClick={addProperty}>+Add Property</div>
		</div>
	)
}

export default NewSchemaModalContentComponent
