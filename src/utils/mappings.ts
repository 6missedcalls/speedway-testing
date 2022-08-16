export interface IschemaTypeMap {
	list: number
	boolean: number
	int: number
	float: number
	string: number
	bytes: number
	link: number
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
