import { ReactNode } from "react"

type Props = {
	sidebarContent: ReactNode
	content: ReactNode
}
const Component = ({ content, sidebarContent }: Props) => {
	return (
		<div className="flex-1 flex flex-col min-h-screen">
			<div className="flex-1 flex flex-row">
				<div className="flex-1 dark bg-surface-default p-16">
					{sidebarContent}
				</div>

				<div className="flex items-center p-16">{content}</div>
			</div>
		</div>
	)
}

export default Component
