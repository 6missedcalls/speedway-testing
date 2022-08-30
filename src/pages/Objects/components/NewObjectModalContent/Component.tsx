import { Button, NebulaIcon } from "@sonr-io/nebula-react"
import {
	Bucket,
	IobjectPropertyChange,
	Ischema,
	IschemaField,
} from "../../../../utils/types"

interface NewSchemaModalContentComponentProps {
	closeModal: () => void
	modalSelectedSchema: string
	setModalSelectedSchema: React.Dispatch<React.SetStateAction<string>>
	properties: Array<Record<string, any>>
	handlePropertiesChange: ({ value, index }: IobjectPropertyChange) => void
	schemas: Array<Ischema>
	save: () => void
	handleChangeBucket: (value: string) => void
	buckets: Array<Bucket>
	selectedBucket: string
}

function NewObjectModalContentComponent({
	closeModal,
	save,
	schemas,
	properties,
	handlePropertiesChange,
	modalSelectedSchema,
	setModalSelectedSchema,
	handleChangeBucket,
	selectedBucket,
	buckets,
}: NewSchemaModalContentComponentProps) {
	return (
		<div className="flex flex-col max-h-[90vh]">
			<div className="flex justify-between px-8 my-8">
				<div>
					<span className="text-custom-2xs text-default uppercase font-semibold tracking-custom-x2wider">
						Create Object
					</span>
				</div>
				<div
					className="cursor-pointer text-button-transparent tracking-custom-tight text-custom-sm font-extrabold"
					onClick={closeModal}
				>
					Cancel
				</div>
			</div>

			<div className="flex px-8 mb-8">
				<div className="w-full flex flex-col justify-start">
					<div className="text-default text-custom-sm mb-2 font-extrabold">
						Schema
					</div>
					<div className="relative pointer-events-none select-none border border-default-border rounded-md cursor-pointer flex justify-between">
						<select
							className="appearance-none py-2 px-3 rounded-md pointer-events-auto cursor-pointer w-full"
							onChange={(event) => setModalSelectedSchema(event.target.value)}
							value={modalSelectedSchema}
						>
							{schemas.map((item: Ischema) => (
								<option key={item.schema.did} value={item.schema.did}>
									{item.schema.label}
								</option>
							))}
						</select>
						<NebulaIcon
							iconName="ArrowSquareDown"
							iconType="duotone"
							className="w-8 h-8 pointer-events-none select-none absolute right-0 top-1"
						/>
					</div>
				</div>

				<div className="w-6" />

				<div className="w-full flex flex-col justify-start">
					<div className="text-default text-custom-sm mb-2 font-extrabold">
						Bucket
					</div>
					<div className="relative pointer-events-none select-none border border-default-border rounded-md cursor-pointer flex justify-between">
						<select
							className="appearance-none py-2 px-3 rounded-md pointer-events-auto cursor-pointer w-full"
							onChange={(event) => handleChangeBucket(event.target.value)}
							value={selectedBucket}
						>
							{buckets.map((item: Bucket) => (
								<option key={item.did} value={item.did}>
									{item.label}
								</option>
							))}
						</select>

						<NebulaIcon
							iconName="ArrowSquareDown"
							iconType="duotone"
							className="w-8 h-8 pointer-events-none select-none absolute right-0 top-1"
						/>
					</div>
				</div>
			</div>

			<div className="flex-1 flex flex-col px-8 rounded-2xl overflow-scroll">
				<div className="mb-4 text-default text-custom-sm font-extrabold">
					Properties
				</div>

				<div className="overflow-scroll">
					{properties?.length &&
						properties.map((item, index) => (
							<div key={`${item.name}-${index}`} className="mb-4">
								<div className="text-custom-xs text-subdued pb-1">
									{item.name}
								</div>
								<SchemaField
									field={{ name: item.name, field: item.field }}
									value={item.value}
									onChange={(value) => handlePropertiesChange({ value, index })}
								/>
							</div>
						))}
				</div>
			</div>

			<div className="bg-black w-full rounded-b-2xl justify-end flex relative">
				<div className="absolute rounded-b-2xl w-full h-6 bg-white -top-px" />
				<Button
					styling="w-48 h-12 mb-6 mt-12 mr-8 justify-center items-center text-custom-md font-extrabold tracking-custom-tight"
					onClick={save}
					label="Save"
				/>
			</div>
		</div>
	)
}

type Props = {
	field: IschemaField
	value: string
	onChange: (value: string) => void
}
const SchemaField = ({ field, value, onChange }: Props) => {
	switch (field.field) {
		case 2:
			return (
				<input
					type="number"
					className="border border-default-border rounded-md w-full p-2"
					value={value}
					onChange={(event) => onChange(event.target.value)}
				/>
			)

		case 4:
			return (
				<input
					type="text"
					className="border border-default-border rounded-md w-full p-2"
					value={value}
					onChange={(event) => onChange(event.target.value)}
				/>
			)

		default:
			return <div className="italic text-subdued">Unrecognized field type</div>
	}
}

export default NewObjectModalContentComponent
