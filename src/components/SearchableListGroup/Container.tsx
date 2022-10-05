import { useState } from "react"
import { useSelector } from "react-redux"
import { selectAllObjects } from "../../redux/slices/bucketSlice"
import { SchemaMeta } from "../../utils/types"
import SearchableListGroupComponent from "./Component"

interface SearchableListGroupContainerProps {
	schema: SchemaMeta
}

function SearchableListGroupContainer({
	schema,
}: SearchableListGroupContainerProps) {
	const allObjects = useSelector(selectAllObjects)
	const [mainInputIsChecked, setMainInputIsChecked] = useState(false)

	function onChangeMainInput() {
		setMainInputIsChecked(!mainInputIsChecked)
	}

	return (
		<SearchableListGroupComponent
			schema={schema}
			list={allObjects}
			onChangeMainInput={onChangeMainInput}
			mainInputIsChecked={mainInputIsChecked}
		/>
	)
}

export default SearchableListGroupContainer
