import { useState } from "react"
import { useSelector } from "react-redux"
import { selectAllObjects } from "../../redux/slices/bucketSlice"
import { objectsSelectionCheckbox, SchemaMeta } from "../../utils/types"
import CheckboxListGroupComponent from "./Component"

interface CheckboxListGroupContainerProps {
	schema: SchemaMeta
	checkboxes: objectsSelectionCheckbox[]
	setCheckboxes: any
	onChange: Function
	defaultOpen: boolean
}

function CheckboxListGroupContainer({
	schema,
	checkboxes,
	setCheckboxes,
	onChange,
	defaultOpen,
}: CheckboxListGroupContainerProps) {
	const allObjects = useSelector(selectAllObjects)
	const [mainCheckboxIsChecked, setMainCheckboxIsChecked] = useState(false)
	const [isOpen, setIsOpen] = useState(defaultOpen)

	function toggleOpen() {
		setIsOpen(!isOpen)
	}

	function onChangeMainCheckbox() {
		const currentMainCheckboxIsChecked = !mainCheckboxIsChecked
		setCheckboxes(
			checkboxes.map((checkbox) => {
				if (checkbox.schemaDid === schema.did) {
					return {
						...checkbox,
						checked: currentMainCheckboxIsChecked,
					}
				}
				return checkbox
			})
		)
		setMainCheckboxIsChecked(currentMainCheckboxIsChecked)
	}

	return (
		<CheckboxListGroupComponent
			schema={schema}
			list={allObjects}
			onChangeMainCheckbox={onChangeMainCheckbox}
			mainCheckboxIsChecked={mainCheckboxIsChecked}
			onChange={onChange}
			checkboxes={checkboxes}
			isOpen={isOpen}
			toggleOpen={toggleOpen}
		/>
	)
}

export default CheckboxListGroupContainer
