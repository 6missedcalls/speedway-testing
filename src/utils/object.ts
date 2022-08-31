export function isEmptyObject(obj: Record<string, any>) {
	return (
		obj &&
		Object.keys(obj).length === 0 &&
		Object.getPrototypeOf(obj) === Object.prototype
	)
}

export function arrayObjectDistinct(
	arr: Array<Record<string, any>>,
	key: string
) {
	const uniqueIds: Array<boolean> = []

	return arr.filter((element: Record<string, any>) => {
		const isDuplicate = uniqueIds.includes(element[key])

		if (!isDuplicate) {
			uniqueIds.push(element[key])
			return true
		}
		return false
	})
}


export function parseJsonFromBase64String(string: string){
	try  {
		return JSON.parse(window.atob(string))
	} catch(error){
		console.error(error)
		return {}
	}
}