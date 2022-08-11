import { useContext, useState } from "react"
import { AppModalContext } from "../../../../contexts/appModalContext/appModalContext"
import NewSchemaModalContentComponent from "./Component"

const emptyProperty = {
	name: "",
	type: "string",
}

function NewSchemaModalContentContainer() {
	const { closeModal } = useContext(AppModalContext)
	const [schemaName, setSchemaName] = useState("")
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

	function saveSchema() {
		const schema = {
			...properties.filter((property) => property.name && property.type),
			schemaName,
		}

		console.log("schema to be saved", schema)
	}

	return (
		<NewSchemaModalContentComponent
			closeModal={closeModal}
			properties={properties}
			addProperty={addProperty}
			schemaName={schemaName}
			setSchemaName={setSchemaName}
			handlePropertyChange={handlePropertyChange}
			saveSchema={saveSchema}
		/>
	)
}

export default NewSchemaModalContentContainer
