export class ErrorHasAtLeastOneLowercaseCharacter extends Error {
	private static _message: string =
		"Should have at least one lowercase character."

	constructor() {
		super(ErrorHasAtLeastOneLowercaseCharacter._message)
	}
}
