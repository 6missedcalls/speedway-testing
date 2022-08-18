import { ErrorHasAtLeastOneLowercaseCharacter } from "./Errors/HasAtLeastOneLowercaseCharacter"
import { ErrorHasAtLeastOneNumber } from "./Errors/HasAtLeastOneNumber"
import { ErrorHasAtLeastOneUppercaseCharacter } from "./Errors/HasAtLeastOneUppercaseCharacter"
import { ErrorHasNoSpecialCharacters } from "./Errors/HasNoSpecialCharacters"
import { ErrorHasSpecialCharacter } from "./Errors/HasSpecialCharacter"
import { ErrorIsRequired } from "./Errors/IsRequired"
import { ErrorNoSpaces } from "./Errors/noSpaces"

export function isRequired(value: string): Error | true {
	if (!value) return new ErrorIsRequired()
	return true
}

export function hasAtLeastOneSpecialCharacter(str: string): Error | true {
	if (!/[~!@#$%^&*_\-+=\\`|\\(){}[\]:;"'<>,.?/]/.test(str))
		return new ErrorHasSpecialCharacter()
	return true
}

export function hasNoSpecialCharacter(str: string): Error | true {
	if (/[~!@#$%^&*_\-+=\\`|\\(){}[\]:;"'<>,.?/]/.test(str))
		return new ErrorHasNoSpecialCharacters()
	return true
}

export function hasAtLeastOneUppercaseCharacter(str: string): Error | true {
	if (!/[A-Z]+/.test(str)) return new ErrorHasAtLeastOneUppercaseCharacter()
	return true
}

export function hasAtLeastOneLowercaseCharacter(str: string): Error | true {
	if (!/[a-z]+/.test(str)) return new ErrorHasAtLeastOneLowercaseCharacter()
	return true
}

export function hasAtLeastOneNumber(str: string): Error | true {
	if (!/\d+/.test(str)) return new ErrorHasAtLeastOneNumber()
	return true
}

export function noSpaces(value: string): Error | true {
	if (!/^\S*$/.test(value)) return new ErrorNoSpaces()
	return true
}
