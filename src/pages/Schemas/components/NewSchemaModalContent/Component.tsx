import { Iproperty, handlePropertyChangeProps } from "../../../../utils/types"
import SchemaPropertyLine from "../SchemaPropertyLine"
import { Button } from "@sonr-io/nebula-react"

interface NewSchemaModalContentComponentProps {
	closeModal: () => void
	properties: Array<Iproperty>
	handlePropertyChange: ({ index, data }: handlePropertyChangeProps) => void
	addProperty: () => void
	schemaName: string
	error: string
	onChangeSchemaName: (value: string) => void
	saveSchema: () => void
}

function NewSchemaModalContentComponent({
	closeModal,
	properties,
	handlePropertyChange,
	addProperty,
	schemaName,
	error,
	onChangeSchemaName,
	saveSchema,
}: NewSchemaModalContentComponentProps) {
	return (
		<div>
			<div className="flex flex-col p-8 rounded-2xl">
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
						placeholder="Schema Name"
						value={schemaName}
						onChange={(event) => onChangeSchemaName(event.target.value)}
					/>
				</div>
				<div className="flex justify-between mb-4 text-default text-custom-sm font-extrabold">
					<div className="w-9/12">
						<span className="block">Property</span>
					</div>
					<div className="w-3/12 ml-2">
						<span className="block">Type</span>
					</div>
				</div>
				<div className="max-h-[50vh] overflow-y-auto mb-6">
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
				<Button
					styling="font-extrabold"
					label="+ Add Property"
					onClick={addProperty}
					skin="transparent"
				/>
			</div>
			{error && (
				<div className="pl-8">
					<span className="text-tertiary-red block text-xs">{error}</span>
				</div>
			)}
			<div className="dark bg-surface-default w-full rounded-b-2xl justify-end flex relative">
				<div className="absolute rounded-b-2xl w-full h-6 bg-white -top-px" />
				<Button
					styling="w-48 h-12 mb-6 mt-12 mr-8 justify-center items-center text-custom-md font-extrabold tracking-custom-tight"
					onClick={saveSchema}
					label="Save"
				/>
			</div>
		</div>
	)
}

export default NewSchemaModalContentComponent
