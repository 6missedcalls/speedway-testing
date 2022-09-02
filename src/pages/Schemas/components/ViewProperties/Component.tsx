import { useRef } from "react"
import useDetectOutsideClick from "../../../../hooks/useDetectOutsideClick"
import { ItypeSchemaMap, typeSchemaMap } from "../../../../utils/mappings"
import { IpropertyResponse } from "../../../../utils/types"

interface ViewPropertiesComponentProps {
	properties: Array<IpropertyResponse>
	onClick: () => void
	isOpen: boolean
	close: () => void
}

function ViewPropertiesComponent({
	properties = [],
	onClick,
	isOpen,
	close,
}: ViewPropertiesComponentProps) {
	const divRef = useRef(null)
	useDetectOutsideClick({ ref: divRef, callback: close })

	return (
		<div className="relative w-20">
			<div
				className="w-20 h-8 bg-button-subtle rounded cursor-pointer flex justify-center items-center"
				onClick={onClick}
			>
				<span className="block font-extrabold text-custom-xs text-button-subtle">
					View
				</span>
			</div>
			{properties && properties.length > 0 && isOpen && (
				<div
					ref={divRef}
					className="absolute min-w-52 shadow-3xl rounded bg-white right-0 top-11 border border-surface-button-subtle px-4 py-3 z-10"
				>
					{properties?.length &&
						properties.map((property, index) => (
							<div
								className={`flex justify-between items-center ${
									index === properties.length - 1 ? "" : "mb-6"
								}`}
								key={`${property.name}`}
							>
								<div className="text-default text-custom-xs font-extrabold whitespace-nowrap">
									{property.name}
								</div>
								<div className="text-custom-xxs font-extrabold text-subdued tracking-custom-tighter ml-4 whitespace-nowrap">
									{typeSchemaMap[property.type as keyof ItypeSchemaMap]}
								</div>
							</div>
						))}
				</div>
			)}
		</div>
	)
}

export default ViewPropertiesComponent
