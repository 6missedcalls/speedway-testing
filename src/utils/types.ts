export enum listTypes {
	schema,
	object,
}

export interface IlistItem {
	name: string
	did: string
	version: number
	objects: number
	fieldCount: number
}
