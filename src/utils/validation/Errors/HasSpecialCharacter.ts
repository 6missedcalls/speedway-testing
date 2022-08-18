export class ErrorHasSpecialCharacter extends Error {
	private static _message: string =
		"Should have at least one special character."

	constructor() {
		super(ErrorHasSpecialCharacter._message)
	}
}
