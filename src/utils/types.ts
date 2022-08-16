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

export interface IschemaField {
	name: string
	field: number
}
export interface Ischema {
	definition: {
		creator: string
		label: string
		fields: Array<IschemaField>
	}
	whatIs: {
		did: string
		schema: {
			did: string
			label: string
			cid: string
		}
		creator: string
		timestamp?: number
		is_active: boolean
	}
}
