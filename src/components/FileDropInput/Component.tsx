import { FormEvent } from "react"
import CheckedSvg from "../../assets/svgs/Checked"

interface FileDropInputComponentProps {
	onInput: (e: FormEvent<HTMLInputElement>) => void
	dropId: string
	hasFile: boolean
	setHasFile: Function
}

function FileDropInputComponent({
	onInput,
	dropId,
	hasFile,
	setHasFile,
}: FileDropInputComponentProps) {
	if (hasFile)
		return (
			<div className="p-4 border-dashed border-3 flex justify-center items-center">
				<div className="mr-2 w-12 h-12 flex justify-center align-center">
					<CheckedSvg />
				</div>
				<div
					className="text-tertiary-red font-extrabold text-custom-md cursor-pointer"
					onClick={() => setHasFile(false)}
				>
					Remove
				</div>
			</div>
		)

	return (
		<div id={dropId} className="p-4 border-dashed border-3">
			<input
				hidden
				type="file"
				onInput={(event: FormEvent<HTMLInputElement>) => onInput(event)}
				id={`${dropId}-input`}
				name={`${dropId}-fileInput`}
			/>
			<div className="text-center w-full">
				<span className="font-semibold text-secondary-800">
					Drag & drop file
				</span>
			</div>
			<div
				className="text-center cursor-pointer"
				onClick={() => document.getElementById(`${dropId}-input`)!.click()}
			>
				<span>or </span>
				<span className="decoration-solid text-primary-700 underline">
					browse media in your device
				</span>
			</div>
		</div>
	)
}

export default FileDropInputComponent
