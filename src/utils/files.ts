const Buffer = require("buffer/").Buffer

export function fileToBase64(file: File) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = function () {
			resolve(reader.result)
		}
		reader.onerror = function (error) {
			reject(error)
		}
	})
}

export function downloadFileFromBase64(base64Data: string, name: string) {
	const a = document.createElement("a")
	a.href = base64Data
	a.download = name
	a.click()
	a.remove()
}
