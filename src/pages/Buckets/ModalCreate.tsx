import { useContext, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import RefreshSvg from "../../assets/svgs/Refresh"
import { AppModalContext } from "../../contexts/appModalContext/appModalContext"
import { selectAddress } from "../../redux/slices/authenticationSlice"
import {
	createBucket,
	getAllBuckets,
	selectBucketCreationLoading,
} from "../../redux/slices/bucketSlice"
import { AppDispatch } from "../../redux/store"

const ModalCreateBucket = () => {
	const [label, setLabel] = useState("")
	const { closeModal } = useContext(AppModalContext)
	const dispatch = useDispatch<AppDispatch>()
	const address = useSelector(selectAddress)
	const save = async () => {
		await dispatch(createBucket({ label, creator: address }))
		dispatch(getAllBuckets(address))
		closeModal()
	}
	const loading = useSelector(selectBucketCreationLoading)

	return (
		<div>
			{!loading && (
				<>
					<div className="rounded-2xl p-8">
						<div className="flex flex-row mb-2">
							<span className="flex-1 uppercase font-semibold text-custom-sm text-default">
								New Bucket
							</span>
							<button
								className="font-extrabold text-button-transparent text-custom-sm"
								onClick={closeModal}
							>
								Cancel
							</button>
						</div>

						<input
							className="text-custom-xl text-default font-extrabold"
							type="text"
							placeholder="Bucket Name"
							value={label}
							onChange={({ target }) => setLabel(target.value)}
						/>
					</div>

					<div className="dark bg-surface-default py-6 px-8 text-right rounded-b-2xl">
						<button
							onClick={save}
							className="text-skin-primary bg-skin-primary font-extrabold rounded py-2 px-6 min-w-[200px]"
						>
							Save
						</button>
					</div>
				</>
			)}

			{loading && (
				<div className="flex flex-col items-center">
					<div className="w-28 m-20 animate-reverse-spin">
						<RefreshSvg />
					</div>
				</div>
			)}
		</div>
	)
}

export default ModalCreateBucket
