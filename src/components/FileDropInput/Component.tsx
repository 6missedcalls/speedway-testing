import { FormEvent } from "react"
import CheckedSvg from "../../assets/svgs/Checked"
import { FileUploader } from "react-drag-drop-files"

interface FileDropInputComponentProps {
	onInput: (e: FormEvent<HTMLInputElement>) => void
	hasFile: boolean
	setHasFile: Function
	onRemove: Function
	onSizeError: Function
}

function FileDropInputComponent({
	onInput,
	onRemove,
	hasFile,
	setHasFile,
	onSizeError,
}: FileDropInputComponentProps) {
	if (hasFile)
		return (
			<div className="p-4 border-dashed border-3 flex justify-center items-center">
				<div className="mr-2 w-12 h-12 flex justify-center align-center">
					<CheckedSvg />
				</div>
				<div
					className="text-tertiary-red font-extrabold text-custom-md cursor-pointer"
					onClick={() => {
						setHasFile(false)
						onRemove()
					}}
				>
					Remove
				</div>
			</div>
		)

	return (
		<FileUploader
			hoverTitle=" "
			maxSize={1}
			onSizeError={onSizeError}
			handleChange={onInput}
			name="file"
			children={
				<div className="p-4 border-dashed border-3">
					<div className="text-center w-full">
						<span className="font-semibold text-secondary-800">
							Drag & drop file
						</span>
					</div>
					<div className="text-center cursor-pointer">
						<span>or </span>
						<span className="decoration-solid text-primary-700 underline">
							browse media in your device
						</span>
					</div>
				</div>
			}
		/>
	)
}

export default FileDropInputComponent
