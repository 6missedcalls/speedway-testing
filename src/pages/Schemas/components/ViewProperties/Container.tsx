import { useState } from "react"
import { useDispatch } from "react-redux"
import { userGetSchema } from "../../../../redux/slices/schemasSlice"
import { IgetSchemaFields, IpropertyResponse } from "../../../../utils/types"
import ViewPropertiesComponent from "./Component"

interface ViewPropertiesContainerProps {
	onClick: () => void
	getSchemaPayload: IgetSchemaFields
}

function ViewPropertiesContainer({
	getSchemaPayload,
}: ViewPropertiesContainerProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [properties, setProperties] = useState<Array<IpropertyResponse>>([])
	const dispatch = useDispatch<any>()

	async function getSchema() {
		const getSchemaResponse = await dispatch(
			userGetSchema({ schema: getSchemaPayload })
		)
		setProperties(getSchemaResponse.payload.fields)
		setIsOpen(true)
	}

	function close() {
		setIsOpen(false)
	}

	return (
		<ViewPropertiesComponent
			key={getSchemaPayload.schema}
			properties={properties}
			onClick={getSchema}
			isOpen={isOpen}
			close={close}
		/>
	)
}

export default ViewPropertiesContainer
