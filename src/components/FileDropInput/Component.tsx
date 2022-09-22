import { FormEvent } from "react"

interface FileDropInputComponentProps {
    onInput: (e: FormEvent<HTMLInputElement>) => void
    dropId: string
}

function FileDropInputComponent({
    onInput,
    dropId
}: FileDropInputComponentProps){
    return (
        <div id={dropId}>
            <input 
                hidden 
                type="file" 
                onInput={(event: FormEvent<HTMLInputElement>) => onInput(event)} 
                id={`${dropId}-input`} 
                name="fileInput" 
            />
            <div className="text-center w-full">
            <span className="font-semibold text-secondary-800">Drag & drop file</span>
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