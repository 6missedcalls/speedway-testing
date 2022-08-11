interface SchemaPropertyComponentProps {
	handlePropertyChange: any
	property: any
	propertyIndex: number
}

function SchemaPropertyComponent({
	handlePropertyChange,
	property,
	propertyIndex,
}: SchemaPropertyComponentProps) {
	return (
		<div className="flex justify-between">
			<input
				type="text"
				placeholder="Property Name"
				onChange={(event) =>
					handlePropertyChange({
						data: { name: event.target.value },
						index: propertyIndex,
					})
				}
				value={property.name}
			/>
			<select
				onChange={(event) =>
					handlePropertyChange({
						data: { type: event.target.value },
						index: propertyIndex,
					})
				}
				value={property.type}
			>
				<option value="string">String</option>
				<option value="int">Integer</option>
			</select>
		</div>
	)
}

export default SchemaPropertyComponent
