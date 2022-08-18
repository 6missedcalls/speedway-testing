export class ErrorIsRequired extends Error {
	private static _message: string = "Field is required."

	constructor() {
		super(ErrorIsRequired._message)
	}
}
