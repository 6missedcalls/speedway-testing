interface BaseLayoutComponentProps {
	children: React.ReactNode
}

function BaseLayoutComponent({ children }: BaseLayoutComponentProps) {
	return (
		<div className="flex font-['Manrope']">
			<div className="w-full relative">{children}</div>
		</div>
	)
}

export default BaseLayoutComponent
