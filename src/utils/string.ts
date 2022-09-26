export function slugify(str: string) {
	str = str.replace(/^\s+|\s+$/g, "") // trim
	str = str.toLowerCase()

	var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;"
	var to = "aaaaeeeeiiiioooouuuunc------"
	for (var i = 0, l = from.length; i < l; i++) {
		str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i))
	}

	str = str
		.replace(/[^a-z0-9 -]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")

	return str
}

export function isAddress(str: string) {
	return /^snr/g.test(str)
}
