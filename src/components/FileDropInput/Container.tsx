import FileDropInputComponent from "./Component"
import { FormEvent, useState } from "react"

interface FileDropInputContainerProps {
	onInput: (e: FormEvent<HTMLInputElement>) => void
	onSizeError: Function
}

function FileDropInputContainer({
	onInput,
	onSizeError,
}: FileDropInputContainerProps) {
	const [hasFile, setHasFile] = useState(false)

	return (
		<FileDropInputComponent
			onSizeError={onSizeError}
			setHasFile={setHasFile}
			onInput={(file: any) => {
				setHasFile(true)
				onInput(file)
			}}
			hasFile={hasFile}
		/>
	)
}

export default FileDropInputContainer
