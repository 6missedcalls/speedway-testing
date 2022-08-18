interface BaseLayoutComponentProps {
	isLogged: boolean
	children: React.ReactNode
}

function BaseLayoutComponent({ isLogged, children }: BaseLayoutComponentProps) {
	return (
		<div className="flex font-['Manrope']">
			<div className="w-full relative">{children}</div>
		</div>
	)
}

export default BaseLayoutComponent
