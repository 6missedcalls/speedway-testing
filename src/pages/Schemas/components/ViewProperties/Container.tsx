import { useState } from "react"
import { SchemaField } from "../../../../utils/types"
import ViewPropertiesComponent from "./Component"

const ViewPropertiesContainer = ({ fields }: { fields: SchemaField[] }) => {
	const [isOpen, setIsOpen] = useState(false)

	function close() {
		setTimeout(() => {
			setIsOpen(false)
		}, 100)
	}

	return (
		<ViewPropertiesComponent
			properties={fields}
			onClick={() => {
				setIsOpen(!isOpen)
			}}
			isOpen={isOpen}
			close={close}
		/>
	)
}

export default ViewPropertiesContainer
