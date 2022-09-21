import { FC } from "react"

export enum ListTypes {
	schema,
	object,
}

export interface IchangedProperty {
	name?: string
	type?: string
}

export interface handlePropertyChangeProps {
	index: number
	data: IchangedProperty
}

export interface Iproperty {
	name: string
	type: string
}

export interface InewSchema {
	address: string
	label: string
	fields: Record<string, number>
}

export interface InewObject {
	schemaDid: string
	label: string
	object: Record<string, any>
}

export type SchemaMeta = {
	did: string
	label: string
	fields: SchemaField[]
}

export type SchemaField = {
	name: string
	type: number
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

export type SonrObject = {
	cid: string
	schemaDid: string
	data: ObjectData
}

export type ObjectData = { [key: string]: any }

export type SearchableListItemData = {
	text?: string
	Component?: FC<any>
	props?: Record<string, any>
}

export type SearchableListItem = {
	[key: string]: SearchableListItemData
}

export type SearchableList = SearchableListItem[]

export interface updateBucketProps {
	bucketDid: string
	objectCid: string
	schemaDid: string
}
