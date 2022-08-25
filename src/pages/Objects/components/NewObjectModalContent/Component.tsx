import { Button, NebulaIcon } from "@sonr-io/nebula-react"
import TextInput from "../../../../components/TextInput"
import { Bucket, IobjectPropertyChange, Ischema } from "../../../../utils/types"

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
		<div>
			<div className="flex flex-col p-8 rounded-2xl">
				<div className="flex justify-between">
					<div>
						<span className="text-custom-2xs text-default uppercase font-semibold tracking-custom-x2wider">
							Object Properties
						</span>
					</div>
					<div
						className="cursor-pointer text-button-transparent tracking-custom-tight text-custom-sm font-extrabold"
						onClick={closeModal}
					>
						Cancel
					</div>
				</div>
				<div className="flex justify-between">
					<div className="w-full flex flex-col justify-start">
						<div>Schemas</div>
						<div className="w-full relative pointer-events-none select-none border border-default-border rounded-md w-3/12 cursor-pointer flex justify-between">
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
						<div>Buckets</div>
						<div className="w-full relative pointer-events-none select-none border border-default-border rounded-md w-3/12 cursor-pointer flex justify-between">
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
				<div>
					<div>Properties</div>
					{properties.map((item, index) => (
						<div key={`${item.name}-${index}`}>
							<TextInput
								label={item.name}
								ariaLabel={item.name}
								handleOnChange={(event: React.ChangeEvent<HTMLInputElement>) =>
									handlePropertiesChange({ value: event.target.value, index })
								}
								value={item?.value || ""}
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

export default NewObjectModalContentComponent
