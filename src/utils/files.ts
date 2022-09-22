const Buffer = require('buffer/').Buffer

export function fileToByteArray(file: any){
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.addEventListener('load', e => {
            if(!e?.target?.result) return
            const arr = new Uint8Array(e.target.result as ArrayBuffer)
            const buffer = Buffer.from(arr)
            resolve(buffer)
        })
        reader.addEventListener('error', err => {
            reject('FileReader error' + err)
        })
        reader.readAsArrayBuffer(file)
    })

}

export function parseFileValueFromByteArrayAndDownload(byteArray: ArrayBuffer, name: string){
    const downloadElement = document.createElement('a')
    downloadElement.style.display = 'none'
    downloadElement.href = window.URL.createObjectURL(new Blob([byteArray]))
    downloadElement.download = name
    document.body.appendChild(downloadElement)
    downloadElement.click()
    window.URL.revokeObjectURL(downloadElement.href)
	downloadElement.remove()
}