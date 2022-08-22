import { NebulaIcon } from "@sonr-io/nebula-react"

const EmptyList = () => {
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

				<h2 className="text-custom-lg font-extrabold text-subdued">
					No Buckets to Display
				</h2>
			</div>
		</div>
	)
}

export default EmptyList
