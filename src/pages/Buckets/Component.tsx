import { useContext } from "react"
import EmptyList from "../../components/EmptyList"
import LayoutMenu from "../../components/LayoutMenu"
import { AppModalContext } from "../../contexts/appModalContext/appModalContext"
import { MODAL_CONTENT_NEW_BUCKET } from "../../utils/constants"
import { Bucket } from "../../utils/types"

type Props = {
	data: Bucket[]
}
const BucketsPageComponent = ({ data }: Props) => {
	const { setModalContent, openModal } = useContext(AppModalContext)
	const openNewBucketModal = () => {
		setModalContent({ content: MODAL_CONTENT_NEW_BUCKET })
		openModal()
	}

	return (
		<LayoutMenu>
			<div className="h-screen bg-gray-100">
				<div className="py-14 px-10">
					<div className="flex flex-row">
						<h1 className="flex-1 text-custom-3xl font-extrabold tracking-custom-x2tighter text-default">
							Buckets
						</h1>

						<button
							className="self-center text-skin-primary bg-skin-primary font-extrabold rounded py-2 px-6"
							onClick={openNewBucketModal}
						>
							Create Bucket
						</button>
					</div>

					{!data.length && <EmptyList message="No Buckets to Display" />}

					{!!data.length && (
						<div className="flex flex-wrap gap-6 mt-8">
							{data.map(BucketCard)}
						</div>
					)}
				</div>
			</div>
		</LayoutMenu>
	)
}
export default BucketsPageComponent

const BucketCard = (bucket: Bucket) => (
	<div
		className="bg-white rounded-2xl w-[330px] h-[160px] shadow-xxl p-6 text-default"
		key={bucket.did}
	>
		<h2 className="font-extrabold text-custom-lg whitespace-nowrap overflow-hidden text-ellipsis mb-6">
			{bucket.label}
		</h2>

		<div className="flex">
			<div className="border rounded-md text-custom-xs">
				<span className="px-[6px] py-[2px] border-r rounded-tr-md text-subdued">
					Objects
				</span>

				<span className="px-[6px] py-[2px] font-extrabold">
					{bucket.objects.length}
				</span>
			</div>
		</div>
	</div>
)
