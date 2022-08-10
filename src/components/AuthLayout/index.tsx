import { ReactNode } from "react"

type Props = {
	sidebarContent: ReactNode
	content: ReactNode
}
export default ({ content, sidebarContent }: Props) => {
	return (
		<div className="flex flex-1 flex-col min-h-screen">
			<div className="flex flex-1 flex-row">
				<div className="flex-1 bg-[#1D1A27] p-16">{sidebarContent}</div>

				<div className="flex items-center p-16">{content}</div>
			</div>
		</div>
	)
}
