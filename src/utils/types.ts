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

export interface IpropertyResponse {
	name: string
	type: number
}

export interface handlePropertyChangeProps {
	index: number
	data: IchangedProperty
}

export interface IschemaField {
	name: string
	type: number
}
export interface Ischema {
	did: string
	schema: {
		did: string
		label: string
		cid?: string
		fields?: Record<string, any>
	}
	creator: string
	timestamp?: number
	is_active: boolean
}

export interface IgetSchemaFields {
	address: string
	creator: string
	schema: string
}
export interface InewSchema {
	address: string
	label: string
	fields: Record<string, number>
}

export interface InewObject {
	schemaDid: string
	label?: string
	object: Record<string, any>
}

export interface IobjectPropertyChange {
	index: number
	value: string
}

export type NewBucketPayload = {
	label: string
	creator: string
	visibility?: string
	role?: string
}

export type Bucket = {
	did: string
	label: string
	creator: string
	content: BucketContent[]
}

export type BucketContent = {
	uri: string
}

export interface IsearchableListItemData {
	text?: string
	Component?: React.FC
	props?: Record<string, any>
}

export interface IsearchableListItem {
	[key: string]: {
		[key: string]: IsearchableListItemData
	}
}

export interface loginPayload {
	address: string
}
