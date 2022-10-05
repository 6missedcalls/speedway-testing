import {
	ListTypes,
	SchemaMeta,
	SearchableListType,
	SearchableListItem,
	SonrObject,
} from "../../utils/types"
import SearchableList from "../SearchableList"

interface SearchableListGroupComponentProps {
	schema: SchemaMeta
	list: SonrObject[]
	onChangeMainInput: Function
	mainInputIsChecked: boolean
}

function SearchableListGroupComponent({
	schema,
	list,
	onChangeMainInput,
	mainInputIsChecked,
}: SearchableListGroupComponentProps) {
	function mapToListFormat(
		objectsList: SonrObject[],
		schemaDid: string
	): SearchableListType {
		const newList = objectsList
			.filter((item: SonrObject) => item.schemaDid === schemaDid)
			.map(({ cid, data }: SonrObject): SearchableListItem => {
				const listItem: SearchableListItem = {}
				listItem[""] = {
					text: "",
					Component: () => (
						<div>
							<input
								checked={true}
								type="checkbox"
								onChange={() => console.log("cid", cid)}
							/>
						</div>
					),
				}
				listItem.cid = { text: cid }
				Object.keys(data).forEach((key) => {
					if (data[key]?.bytes) {
						listItem[key] = {
							text: "",
							Component: () => (
								<div
									className="w-20 h-8 bg-button-subtle rounded cursor-pointer flex justify-center items-center"
									onClick={() => {}}
								>
									<span className="block font-extrabold text-custom-xs text-button-subtle">
										Download
									</span>
								</div>
							),
						}
					} else {
						listItem[key] = {
							text: data[key].toString(),
						}
					}
				})
				return listItem
			})
		console.log("newList", newList)

		return newList
	}

	return (
		<div className="flex flex-col justify-start items-start">
			<div className="flex h-10 hover:text-white w-full rounded-t-md hover:bg-surface-button-subtle-hovered bg-surface-button-subtle cursor-pointer ">
				<label>
					<input
						type="checkbox"
						checked={mainInputIsChecked}
						onChange={() => onChangeMainInput()}
					/>
					{schema.label}
				</label>
			</div>
			<SearchableList
				hideSearchBar={true}
				initialList={mapToListFormat(list, schema.did)}
				type={ListTypes.object}
				loading={false}
			/>
		</div>
	)
}

export default SearchableListGroupComponent
