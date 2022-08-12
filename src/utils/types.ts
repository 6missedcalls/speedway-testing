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

export interface IchangedProperty {
	name?: string
	type?: string
}

export interface Iproperty {
	name: string
	type: string
}

export interface handlePropertyChangeProps {
	index: number
	data: IchangedProperty
}
