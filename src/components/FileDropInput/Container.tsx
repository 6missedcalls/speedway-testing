import FileDropInputComponent from "./Component"
import dragDrop from 'drag-drop'
import { FormEvent, useEffect, useState } from "react"

interface FileDropInputContainerProps {
    onInput: (e: FormEvent<HTMLInputElement>) => void
    onLoad: (files: any) => void
    onDrop: (files: any) => void
    dropId: string
}

function FileDropInputContainer({
    onInput,
    onLoad,
    onDrop,
    dropId
}: FileDropInputContainerProps){
    const [hasFile, setHasFile] = useState(false)

    useEffect(() => {
        dragDrop(
            `#${dropId}`, {
                onDrop: (files: any) => {
                    setHasFile(true)
                    onLoad(files)
                },
            }
        )
    }, [])

    return (
        <FileDropInputComponent 
            setHasFile={setHasFile}
            onInput={(event: any) => {
                setHasFile(true)
                onInput(event)
            }} 
            dropId={dropId}
            hasFile={hasFile}
        />
    )
}

export default FileDropInputContainer