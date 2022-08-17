export interface IschemaTypeMap {
	list: number
	boolean: number
	int: number
	float: number
	string: number
	bytes: number
	link: number
}

export interface ItypeSchemaMap {
	0: string
	1: string
	2: string
	3: string
	4: string
	5: string
	6: string
}

export const schemaTypeMap: IschemaTypeMap = {
	list: 0,
	boolean: 1,
	int: 2,
	float: 3,
	string: 4,
	bytes: 5,
	link: 6,
}

export const typeSchemaMap: ItypeSchemaMap = {
	0: "list",
	1: "boolean",
	2: "integer",
	3: "float",
	4: "string",
	5: "bytes",
	6: "link",
}
