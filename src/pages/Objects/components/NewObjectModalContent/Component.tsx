import { ChangeEvent, Dispatch, SetStateAction, useState } from "react"
import { Button, NebulaIcon } from "@sonr-io/nebula-react"
import FileDropInput from "../../../../components/FileDropInput"
import { Bucket, SchemaField, SchemaMeta } from "../../../../utils/types"

interface NewObjectModalContentComponentProps {
	onClose: () => void
	onSave: () => void
	onChangeSchema: Dispatch<SetStateAction<string>>
	onChangeBucket: (value: string) => void
	onChangeProperty: (index: number, value: any) => void
	schemas: Array<SchemaMeta>
	buckets: Array<Bucket>
	properties: Array<Record<string, any>>
	selectedSchema: string
	selectedBucket: string
	error: string
	setError: Dispatch<SetStateAction<string>>
	unsetPropertyValue: (index: number) => void
}

function NewObjectModalContentComponent({
	onClose,
	onSave,
	onChangeSchema,
	onChangeBucket,
	onChangeProperty,
	schemas,
	properties,
	buckets,
	selectedSchema,
	selectedBucket,
	error,
	setError,
	unsetPropertyValue,
}: NewObjectModalContentComponentProps) {
	return (
		<div className="flex flex-col">
			<div className="flex justify-between px-8 mt-8 mb-2">
				<div>
					<span className="text-custom-2xs text-default uppercase font-semibold tracking-custom-x2wider">
						Create Object
					</span>
				</div>
				<div
					className="cursor-pointer text-button-transparent tracking-custom-tight text-custom-sm font-extrabold"
					onClick={onClose}
				>
					Cancel
				</div>
			</div>

			<div className="flex gap-8 px-8 mb-8">
				<div className="flex flex-col min-w-[216px]">
					<div className="mb-4 text-custom-xl">&nbsp;</div>

					<div className="py-4 border border-transparent">
						<div className="w-full flex flex-col mb-4">
							<div className="text-default text-custom-xs font-extrabold mb-1">
								Schema
							</div>
							<div className="relative pointer-events-none select-none border border-default-border rounded-md cursor-pointer flex justify-between">
								<select
									className="appearance-none py-2 px-3 rounded-md pointer-events-auto cursor-pointer w-full"
									onChange={(event) => onChangeSchema(event.target.value)}
									value={selectedSchema}
								>
									{schemas.map((item: SchemaMeta) => (
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

						<div className="w-full flex flex-col">
							<div className="text-default text-custom-xs font-extrabold mb-1">
								Bucket
							</div>
							<div className="relative pointer-events-none select-none border border-default-border rounded-md cursor-pointer flex justify-between">
								<select
									className="appearance-none py-2 px-3 rounded-md pointer-events-auto cursor-pointer w-full"
									onChange={(event) => onChangeBucket(event.target.value)}
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
				</div>

				<div className="flex-1 flex flex-col">
					<div className="mb-4 text-default text-custom-xl font-extrabold">
						Properties
					</div>

					<div className="flex flex-col overflow-scroll max-h-[50vh] p-4 pb-32 border border-gray-200 rounded-2xl">
						{properties.map((item, index) => (
							<div key={`${item.name}-${index}`} className="mb-4">
								<div className="text-custom-xs text-subdued mb-1">
									{item.name}
								</div>
								<SchemaFieldInput
									index={index}
									field={{ name: item.name, type: item.type }}
									setError={setError}
									unsetPropertyValue={unsetPropertyValue}
									onChange={(value) => onChangeProperty(index, value)}
								/>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="z-10 ml-72 mr-8">
				<span className="text-tertiary-red block text-xs">
					{error}
					&nbsp;
				</span>
			</div>

			<div className="bg-black w-full rounded-b-2xl justify-end flex relative">
				<div className="absolute rounded-b-2xl w-full h-6 bg-white -top-px" />
				<Button
					styling="w-48 h-12 mb-6 mt-12 mr-8 justify-center items-center text-custom-md font-extrabold tracking-custom-tight"
					onClick={onSave}
					label="Save"
				/>
			</div>
		</div>
	)
}

type SchemaFieldInputProps = {
	field: SchemaField
	onChange: (value: string) => void
	setError: Dispatch<SetStateAction<string>>
	index: number
	unsetPropertyValue: (index: number) => void
}

const SchemaFieldInput = ({
	field,
	onChange,
	setError,
	index,
	unsetPropertyValue,
}: SchemaFieldInputProps) => {
	switch (field.type) {
		case 0:
			return <ListInput onChange={onChange} />
		case 1:
			return (
				<select
					className="border border-default-border rounded w-full p-2"
					onChange={(event) => onChange(event.target.value)}
				>
					<option></option>
					<option value="true">True</option>
					<option value="false">False</option>
				</select>
			)
		case 2:
			return (
				<input
					type="number"
					className="border border-default-border rounded-md w-full p-2"
					onChange={(event) => onChange(event.target.value)}
				/>
			)
		case 3:
			return (
				<input
					type="number"
					className="border border-default-border rounded-md w-full p-2"
					onChange={(event) => onChange(event.target.value)}
				/>
			)
		case 4:
			return (
				<input
					type="text"
					className="border border-default-border rounded-md w-full p-2"
					onChange={(event) => onChange(event.target.value)}
				/>
			)
		case 5:
			return (
				<FileDropInput
					onSizeError={setError}
					onChange={onChange}
					onRemove={() => unsetPropertyValue(index)}
				/>
			)

		default:
			return <div className="italic text-subdued">Unrecognized field type</div>
	}
}

const ListInput = ({ onChange }: { onChange: (value: string) => void }) => {
	const [values, setValues] = useState<string[]>([""])
	const addItem = () => {
		const newValues = [...values, ""]
		setValues(newValues)
		onChange(JSON.stringify(newValues))
	}
	const editItem =
		(index: number) => (event: ChangeEvent<HTMLInputElement>) => {
			const newValues = [...values]
			newValues[index] = event.target.value
			setValues(newValues)
			onChange(JSON.stringify(newValues))
		}
	const deleteItem = (index: number) => () => {
		const newValues = values.filter((_, i) => i !== index)
		setValues(newValues)
		onChange(JSON.stringify(newValues))
	}
	return (
		<div className="border-l border-gray-200 pl-2">
			{values.map((value, index) => (
				<div className="flex mb-2" key={index}>
					<input
						className="flex-1 border border-default-border rounded-md w-full p-2"
						value={value}
						onChange={editItem(index)}
					/>
					<button className="p-2 ml-2 text-subdued" onClick={deleteItem(index)}>
						✕
					</button>
				</div>
			))}

			<button
				className="text-button-transparent tracking-custom-tight text-custom-sm font-extrabold py-2"
				onClick={addItem}
			>
				+ Add item
			</button>
		</div>
	)
}

export default NewObjectModalContentComponent
