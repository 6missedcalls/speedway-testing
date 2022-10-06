import { useState } from "react"
import { useSelector } from "react-redux"
import { selectAllObjects } from "../../redux/slices/bucketSlice"
import { objectsSelectionCheckbox, SchemaMeta } from "../../utils/types"
import SearchableListGroupComponent from "./Component"

interface SearchableListGroupContainerProps {
	schema: SchemaMeta
	checkboxes: objectsSelectionCheckbox[]
	setCheckboxes: any
	onChange: Function
	defaultOpen: boolean
}

function SearchableListGroupContainer({
	schema,
	checkboxes,
	setCheckboxes,
	onChange,
	defaultOpen,
}: SearchableListGroupContainerProps) {
	const allObjects = useSelector(selectAllObjects)
	const [mainInputIsChecked, setMainInputIsChecked] = useState(false)
	const [isOpen, setIsOpen] = useState(defaultOpen)

	function toggleOpen() {
		setIsOpen(!isOpen)
	}

	function onChangeMainInput(event: React.ChangeEvent<HTMLInputElement>) {
		event.stopPropagation()

		setCheckboxes(
			checkboxes.map((checkbox) => {
				if (checkbox.schemaDid === schema.did) {
					return {
						...checkbox,
						checked: !mainInputIsChecked,
					}
				}
				return checkbox
			})
		)
		setMainInputIsChecked(!mainInputIsChecked)
	}

	return (
		<SearchableListGroupComponent
			schema={schema}
			list={allObjects}
			onChangeMainInput={onChangeMainInput}
			mainInputIsChecked={mainInputIsChecked}
			onChange={onChange}
			checkboxes={checkboxes}
			isOpen={isOpen}
			toggleOpen={toggleOpen}
		/>
	)
}

export default SearchableListGroupContainer
