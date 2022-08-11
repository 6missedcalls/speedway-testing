import { useContext, useState } from "react"
import { AppModalContext } from "../../../../contexts/appModalContext/appModalContext"
import NewSchemaModalContentComponent from "./Component"

const emptyProperty = {
	name: "",
	type: "",
}

function NewSchemaModalContentContainer() {
	const { closeModal } = useContext(AppModalContext)
	const [properties, setProperties] = useState<Array<any>>([emptyProperty])

	function addProperty() {
		setProperties([...properties, emptyProperty])
	}

	function handlePropertyChange({ index, data }: any) {
		const newProperties = [...properties]
		newProperties.splice(index, 1, {
			...properties[index],
			...data,
		})
		setProperties(newProperties)
	}

	return (
		<NewSchemaModalContentComponent
			closeModal={closeModal}
			properties={properties}
			addProperty={addProperty}
			handlePropertyChange={handlePropertyChange}
		/>
	)
}

export default NewSchemaModalContentContainer
