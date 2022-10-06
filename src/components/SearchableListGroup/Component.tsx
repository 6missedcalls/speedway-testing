import {
	ListTypes,
	SchemaMeta,
	SearchableListType,
	SearchableListItem,
	SonrObject,
	objectsSelectionCheckbox,
} from "../../utils/types"
import SearchableList from "../SearchableList"

interface SearchableListGroupComponentProps {
	schema: SchemaMeta
	list: SonrObject[]
	onChangeMainInput: (event: React.ChangeEvent<HTMLInputElement>) => void
	mainInputIsChecked: boolean
	onChange: Function
	toggleOpen: Function
	checkboxes: objectsSelectionCheckbox[]
	isOpen: boolean
}

function SearchableListGroupComponent({
	schema,
	list,
	onChangeMainInput,
	mainInputIsChecked,
	onChange,
	checkboxes,
	isOpen,
	toggleOpen,
}: SearchableListGroupComponentProps) {
	function mapToListFormat(
		objectsList: SonrObject[],
		schemaDid: string
	): SearchableListType {
		const newList = objectsList
			.filter((item: SonrObject) => item.schemaDid === schemaDid)
			.map(({ cid, data }: SonrObject): SearchableListItem => {
				const listItem: SearchableListItem = {}
				const checkbox = checkboxes.find(
					(checkbox) =>
						checkbox.cid === cid && checkbox.schemaDid === schema.did
				)
				if (checkbox) {
					listItem[""] = {
						text: "",
						Component: () => (
							<div>
								<input
									checked={checkbox.checked}
									type="checkbox"
									onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
										onChange({
											checked: event.target.checked,
											cid,
											schemaDid,
										})
									}
								/>
							</div>
						),
					}
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

		return newList
	}

	return (
		<div className="flex flex-col justify-start items-start">
			<div
				className={`flex w-full
				${
					isOpen
						? "rounded-t-md text-white bg-surface-button-subtle-hovered"
						: "bg-surface-button-subtle rounded-md"
				}
			`}
			>
				<label className="flex items-center px-4">
					<input
						type="checkbox"
						checked={mainInputIsChecked}
						onChange={(e) => {
							e.stopPropagation()
							onChangeMainInput(e)
						}}
					/>
					<span className="block ml-4">{schema.label}</span>
				</label>
				<div
					onClick={() => toggleOpen()}
					className={`
						h-10 w-full cursor-pointer
						
					`}
				/>
			</div>
			<div className={`w-full ${!isOpen ? "hidden" : ""}`}>
				<SearchableList
					hideSearchBar={true}
					initialList={mapToListFormat(list, schema.did)}
					type={ListTypes.object}
					loading={false}
				/>
			</div>
		</div>
	)
}

export default SearchableListGroupComponent
