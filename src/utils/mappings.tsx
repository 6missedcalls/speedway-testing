import ByteTypeDownloadButton from "../components/ByteTypeDownloadButton"
import { ObjectData, SearchableListItem, SonrObject } from "./types"

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

export function replaceFileBase64StringOnObjectList(objects: SonrObject[]) {
	return objects.reduce((acc: Array<SonrObject>, item: SonrObject) => {
		const reworkedData = Object.keys(item.data).reduce(
			(dataAcc: Record<string, any>, key: string) => {
				const dataItem = item.data[key]
				if (!dataItem?.["/"]?.bytes) {
					return {
						...dataAcc,
						[key]: dataItem,
					}
				}

				return {
					...dataAcc,
					[key]: {
						bytes: true,
					},
				}
			},
			{}
		)

		return [
			...acc,
			{
				...item,
				data: reworkedData,
			},
		]
	}, [])
}

interface addDefaultFieldsToObjectsListProps {
	fields: ObjectData
	cid: string
	schemaDid: string
	listItem?: SearchableListItem
}

export function addDefaultFieldsToObjectsList({
	fields,
	cid,
	schemaDid,
	listItem = {},
}: addDefaultFieldsToObjectsListProps) {
	listItem.cid = { text: cid }

	Object.keys(fields).forEach((key) => {
		if (fields[key]?.bytes) {
			listItem[key] = {
				text: "",
				Component: () => {
					return (
						<ByteTypeDownloadButton
							cid={cid}
							itemKey={key}
							schemaDid={schemaDid}
						/>
					)
				},
			}
		} else {
			listItem[key] = {
				text: fields[key].toString(),
			}
		}
	})

	return listItem
}
