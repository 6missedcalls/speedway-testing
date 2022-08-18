import { useState } from "react"
import { useDispatch } from "react-redux"
import LoadingCircleSvg from "../../../../assets/svgs/LoadingCircle"
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
	let loading = false

	async function getSchema() {
		if (properties.length === 0) {
			loading = true
			const getSchemaResponse = await dispatch(
				userGetSchema({ schema: getSchemaPayload })
			)
			setProperties(getSchemaResponse.payload.fields)
			loading = false
		}

		setIsOpen(!isOpen)
	}

	function close() {
		setTimeout(() => {
			setIsOpen(false)
		}, 100)
	}

	if (loading)
		return (
			<div className="w-8 h-8 animate-spin flex justify-center items-center">
				<LoadingCircleSvg />
			</div>
		)

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
