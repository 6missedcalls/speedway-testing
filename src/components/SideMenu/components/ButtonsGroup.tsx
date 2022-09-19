import { Button } from "@sonr-io/nebula-react"
import { useContext } from "react"
import { NavigateFunction } from "react-router-dom"
import { AppSettingsContext } from "../../../contexts/appSettingsContext/appSettingsContext"

interface Ibutton {
	label?: string
	iconName: string
	route: string
}

interface ButtonGroupProps {
	title: string
	buttons: Array<Ibutton>
	navigate: NavigateFunction
	currentPath: string
	className?: string
}

function ButtonGroup({
	title,
	buttons,
	navigate,
	currentPath,
	className,
}: ButtonGroupProps) {
	const { menuIsCollapsed } = useContext(AppSettingsContext)
	
	return (
		<div className={className}>
			<div className="mb-6">
				<span className={`
						${menuIsCollapsed ? 'text-center' : ''}
						block text-custom-2xs uppercase font-semibold text-subdued
					`}
				>
					{title}
				</span>
			</div>
			{buttons.map(({ label, iconName, route }, index) => {
				return (
					<Button
						key={`${label}-${index}`}
						styling={`
							${menuIsCollapsed ? 'justify-center' : ''}
							w-full font-extrabold
						`}
						skin={route === currentPath ? "primary" : ""}
						label={!menuIsCollapsed ? label : ''}
						iconName={iconName}
						iconType={route === currentPath ? "duotone" : "outline"}
						onClick={() => navigate(route)}
					/>
				)
			})}
		</div>
	)
}

export default ButtonGroup
