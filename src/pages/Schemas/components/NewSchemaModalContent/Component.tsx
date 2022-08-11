import SchemaPropertyLine from "../SchemaPropertyLine"
import { handlePropertyChangeProps, Iproperty } from "./Container"

interface NewSchemaModalContentComponentProps {
	closeModal: () => void
	properties: Array<Iproperty>
	handlePropertyChange: ({ index, data }: handlePropertyChangeProps) => void
	addProperty: () => void
	schemaName: string
	setSchemaName: React.Dispatch<React.SetStateAction<string>>
	saveSchema: () => void
}

function NewSchemaModalContentComponent({
	closeModal,
	properties,
	handlePropertyChange,
	addProperty,
	schemaName,
	setSchemaName,
	saveSchema,
}: NewSchemaModalContentComponentProps) {
	return (
		<div className="flex flex-col p-8">
			<div className="flex justify-between">
				<div>
					<span className="text-custom-2xs text-default uppercase font-semibold tracking-custom-x2wider">
						New Schema
					</span>
				</div>
				<div
					className="cursor-pointer text-button-transparent tracking-custom-tight text-custom-sm font-extrabold"
					onClick={closeModal}
				>
					Cancel
				</div>
			</div>
			<div>
				<input
					className="text-custom-xl font-extrabold outline-0 mt-2 mb-8"
					type="text"
					placeholder="SchemaName"
					value={schemaName}
					onChange={(event) => setSchemaName(event.target.value)}
				/>
			</div>
			<div className="flex justify-between">
				<div>Property</div>
				<div>Type</div>
			</div>
			<div className="max-h-[65vh] overflow-y-scroll">
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
			</div>
			<div onClick={addProperty}>+Add Property</div>
			<div onClick={saveSchema}>Save</div>
		</div>
	)
}

export default NewSchemaModalContentComponent
