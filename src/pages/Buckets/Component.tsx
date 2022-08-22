import EmptyList from "../../components/EmptyList"
import LayoutMenu from "../../components/LayoutMenu"

function BucketsPageComponent() {
	return (
		<LayoutMenu>
			<div className="h-screen bg-gray-100">
				<div className="py-14 px-10">
					<div className="flex flex-row">
						<h1 className="flex-1 text-custom-3xl font-extrabold tracking-custom-x2tighter">
							Buckets
						</h1>

						<button className="self-center text-skin-primary font-extrabold bg-skin-primary rounded py-2 px-6">
							Create Bucket
						</button>
					</div>

					<EmptyList message="No Buckets to Display" />
				</div>
			</div>
		</LayoutMenu>
	)
}

export default BucketsPageComponent
