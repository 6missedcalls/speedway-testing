import { handlePropertyChangeProps, Iproperty } from "../../../../utils/types"
import { NebulaIcon } from "@sonr-io/nebula-react"

interface SchemaPropertyComponentProps {
	handlePropertyChange: ({ index, data }: handlePropertyChangeProps) => void
	property: Iproperty
	propertyIndex: number
}

function SchemaPropertyComponent({
	handlePropertyChange,
	property,
	propertyIndex,
}: SchemaPropertyComponentProps) {
	return (
		<div className="flex justify-between mb-4">
			<input
				type="text"
				className="border-default-border tracking-custom-tight placeholder:text-placeholder py-2 px-3 border outline-0 rounded-md text-sm w-9/12"
				placeholder="Property Name"
				onChange={(event) =>
					handlePropertyChange({
						data: { name: event.target.value },
						index: propertyIndex,
					})
				}
				value={property.name}
			/>
			<div className="relative pointer-events-none select-none border border-default-border rounded-md w-3/12 ml-2 cursor-pointer flex justify-between">
				<select
					className="appearance-none py-2 px-3 rounded-md pointer-events-auto cursor-pointer w-full"
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
					<option value="float">Float</option>
					<option value="boolean">Boolean</option>
				</select>
				<NebulaIcon
					iconName="ArrowSquareDown"
					iconType="duotone"
					className="w-8 h-8 pointer-events-none select-none absolute right-0 top-1"
				/>
			</div>
		</div>
	)
}

export default SchemaPropertyComponent
