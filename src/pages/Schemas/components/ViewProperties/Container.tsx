import { useState } from "react"
import { useDispatch } from "react-redux"
import LoadingCircleSvg from "../../../../assets/svgs/LoadingCircle"
import { userGetSchema } from "../../../../redux/slices/schemasSlice"
import { IpropertyResponse } from "../../../../utils/types"
import ViewPropertiesComponent from "./Component"

interface ViewPropertiesContainerProps {
	onClick: () => void
	getSchemaPayload: { schema: string }
}

function ViewPropertiesContainer({
	getSchemaPayload,
}: ViewPropertiesContainerProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [properties, setProperties] = useState<Array<IpropertyResponse>>([])
	const dispatch: Function = useDispatch()

	async function getSchema() {
		if (properties.length === 0) {
			setLoading(true)
			const getSchemaResponse = await dispatch(
				userGetSchema({ schema: getSchemaPayload })
			)
			setProperties(getSchemaResponse.payload.fields)
			setLoading(false)
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
