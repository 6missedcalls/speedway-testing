export function isEmptyObject(obj: any) {
	return (
		obj &&
		Object.keys(obj).length === 0 &&
		Object.getPrototypeOf(obj) === Object.prototype
	)
}

export function arrayStringDistinct(arr: Array<string>) {
    return arr.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
}