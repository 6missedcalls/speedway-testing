import { ReactNode } from "react"

type Props = {
	sidebarContent: ReactNode
	content: ReactNode
}
const Component = ({ content, sidebarContent }: Props) => {
	return (
		<div className="flex flex-1 flex-col min-h-screen">
			<div className="flex flex-1 flex-row">
				<div className="dark flex-1 bg-surface-default p-16">
					{sidebarContent}
				</div>

				<div className="flex items-center p-16">{content}</div>
			</div>
		</div>
	)
}

export default Component
