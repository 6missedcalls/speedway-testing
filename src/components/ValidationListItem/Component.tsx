import CheckedSvg from "../../assets/svgs/Checked"
import DeniedSvg from "../../assets/svgs/Denied"

interface ValidationListItemProps {
	error?: string | boolean
	label: string
}

function ValidationListItem({ error, label }: ValidationListItemProps) {
	return (
		<div className="flex">
			<div className="w-4 mr-2">{error ? <DeniedSvg /> : <CheckedSvg />}</div>
			<div className="flex">{label}</div>
		</div>
	)
}

export default ValidationListItem
