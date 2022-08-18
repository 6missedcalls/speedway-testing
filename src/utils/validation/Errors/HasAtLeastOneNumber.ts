export class ErrorHasAtLeastOneNumber extends Error {
	private static _message: string =
		"Should have at least one numeric character."

	constructor() {
		super(ErrorHasAtLeastOneNumber._message)
	}
}
