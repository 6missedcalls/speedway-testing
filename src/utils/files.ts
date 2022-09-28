const Buffer = require("buffer/").Buffer

export function fileToBase64(file: any) {
	return new Promise((resolve, reject) => {
		var reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = function () {
			resolve(reader.result)
		}
		reader.onerror = function (error) {
			reject(error)
		}
	})
}

interface base64toBlob {
	base64Data: string
	contentType?: string
	sliceSize?: number
}

export function base64toBlob({
	base64Data,
	contentType = "",
	sliceSize = 512,
}: base64toBlob) {
	const byteCharacters = Buffer.from(base64Data)
	const byteArrays = []

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize)

		const byteNumbers = new Array(slice.length)
		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i)
		}

		const byteArray = new Uint8Array(byteNumbers)
		byteArrays.push(byteArray)
	}

	const blob = new Blob(byteArrays, { type: contentType })
	return blob
}

export function parseFileValueFromBase64AndDownload(
	base64Data: string,
	name: string
) {
	console.log("base64Data", base64Data)
	console.log("name", name)
	var a = document.createElement("a")
	a.href = base64Data
	a.download = name
	a.click()
	a.remove()
	// const downloadElement = document.createElement("a")
	// downloadElement.style.display = "none"
	// downloadElement.href = window.URL.createObjectURL(base64toBlob({ base64Data }))
	// downloadElement.download = name
	// document.body.appendChild(downloadElement)
	// downloadElement.click()
	// window.URL.revokeObjectURL(downloadElement.href)
	// downloadElement.remove()
}
