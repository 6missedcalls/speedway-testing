import BaseLayoutComponent from "./Component"

interface BaseLayoutContainerProps {
	children: React.ReactNode
}

function BaseLayoutContainer({ children }: BaseLayoutContainerProps) {
	return <BaseLayoutComponent children={children} />
}

export default BaseLayoutContainer
