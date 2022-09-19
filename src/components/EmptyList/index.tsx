import { NebulaIcon } from "@sonr-io/nebula-react"
import { ReactNode } from "react"

type Props = {
	message: string
	cta?: ReactNode
}
const EmptyList = ({ message, cta }: Props) => {
	return (
		<div className="flex flex-col items-center mt-24">
			<div className="flex flex-col items-center border rounded-2xl py-10 px-16">
				<div className="bg-white p-4 rounded-2xl mb-6">
					<NebulaIcon
						className="w-12 h-12 cursor-pointer"
						iconName="MessageQuestion"
						iconType="duotone"
					/>
				</div>

				<h2 className="text-custom-lg text-center font-extrabold text-subdued">
					{message}
				</h2>

				{cta && <div className="mt-10">{cta}</div>}
			</div>
		</div>
	)
}

export default EmptyList
