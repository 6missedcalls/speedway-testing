import FileDropInputComponent from "./Component"
import dragDrop from 'drag-drop'
import { FormEvent, useEffect } from "react"

interface FileDropInputContainerProps {
    onInput: (e: FormEvent<HTMLInputElement>) => void
    onLoad: (files: any) => void
    dropId: string
}

function FileDropInputContainer({
    onInput,
    onLoad,
    dropId
}: FileDropInputContainerProps){
    useEffect(() => {
        dragDrop(`#${dropId}`, (files: any) => onLoad(files))
    }, [])

    return (
        <FileDropInputComponent 
            onInput={onInput} 
            dropId={dropId}
        />
    )
}

export default FileDropInputContainer