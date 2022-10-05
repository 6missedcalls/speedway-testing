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
}

function SearchableListGroupContainer({
	schema,
	checkboxes,
	setCheckboxes,
	onChange,
}: SearchableListGroupContainerProps) {
	const allObjects = useSelector(selectAllObjects)
	const [mainInputIsChecked, setMainInputIsChecked] = useState(false)

	function onChangeMainInput() {
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
		/>
	)
}

export default SearchableListGroupContainer
