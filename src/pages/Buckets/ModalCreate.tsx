import { useContext, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import RefreshSvg from "../../assets/svgs/Refresh"
import SearchableListGroup from "../../components/SearchableListGroup"
import { AppModalContext } from "../../contexts/appModalContext/appModalContext"
import { selectAddress } from "../../redux/slices/authenticationSlice"
import {
	selectAllObjects,
	selectAllObjectsLoading,
	selectBucketCreationLoading,
	selectBuckets,
	userCreateBucket,
	userGetAllBuckets,
	userGetAllObjects,
} from "../../redux/slices/bucketSlice"
import {
	selectSchemasLoading,
	selectSchemasMetadataList,
	userGetAllSchemas,
} from "../../redux/slices/schemasSlice"
import { AppDispatch } from "../../redux/store"
import { Bucket, objectsSelectionCheckbox } from "../../utils/types"

const ModalCreateBucket = () => {
	const [label, setLabel] = useState("")
	const { closeModal } = useContext(AppModalContext)
	const dispatch = useDispatch<AppDispatch>()
	const [error, setError] = useState("")
	const address = useSelector(selectAddress)
	const buckets = useSelector(selectBuckets)
	const schemas = useSelector(selectSchemasMetadataList)
	const allObjects = useSelector(selectAllObjects)
	const loadingSchemas = useSelector(selectSchemasLoading)
	const loadingAllObjects = useSelector(selectAllObjectsLoading)
	const loadingObjectsSelection = loadingSchemas || loadingAllObjects
	const [checkboxes, setCheckboxes] = useState<objectsSelectionCheckbox[]>([])

	useEffect(() => {
		initialize()
	}, [buckets])

	useEffect(() => {
		setCheckboxes(
			allObjects.map(({ cid, schemaDid }) => ({
				cid,
				schemaDid,
				checked: false,
			}))
		)
	}, [allObjects])

	const initialize = async () => {
		if (buckets.length === 0) return

		dispatch(userGetAllSchemas(address))
		const bucketDids = buckets.map((item: Bucket) => item.did)
		await dispatch(userGetAllObjects({ bucketDids }))
	}

	function onChangeObjectCheckbox({
		checked,
		cid,
		schemaDid,
	}: objectsSelectionCheckbox) {
		if (!cid) return
		const index = checkboxes.findIndex(
			(item) => item.cid === cid && item.schemaDid === schemaDid
		)

		const newCheckboxes = [...checkboxes]
		newCheckboxes.splice(index, 1, {
			cid,
			schemaDid,
			checked,
		})

		setCheckboxes(newCheckboxes)
	}

	const save = async () => {
		if (!label) {
			setError("Bucket Name is required")
			return
		}

		const content = checkboxes
			.filter((checkbox) => checkbox.checked)
			.map((checkbox) => {
				return {
					type: "cid",
					schemaDid: checkbox.schemaDid,
					uri: checkbox.cid,
				}
			})

		const createBucketPayload = {
			label,
			address,
			...(content.length > 0 && { content }),
		}

		await dispatch(userCreateBucket(createBucketPayload))
		dispatch(userGetAllBuckets(address))
		closeModal()
	}
	const loading = useSelector(selectBucketCreationLoading)

	return (
		<div>
			{!loading && (
				<>
					<div className="rounded-2xl p-8">
						<div className="flex flex-row mb-2">
							<span className="flex-1 uppercase font-semibold text-custom-2xs text-default">
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
							className="text-custom-xl text-default font-extrabold outline-0 w-full"
							type="text"
							placeholder="Bucket Name"
							value={label}
							onChange={({ target }) => {
								setError("")
								setLabel(target.value)
							}}
							autoFocus
						/>
					</div>
					{allObjects.length > 0 && (
						<div className="max-h-[50vh] overflow-y-auto p-8">
							<span className="block mb-4 flex-1 uppercase font-semibold text-custom-2xs text-default">
								Add Objects From Schemas
							</span>
							{schemas.map((schema, index) => {
								if (!allObjects.some((obj) => obj.schemaDid === schema.did))
									return null
								return (
									<div key={schema.did} className="mb-2">
										<SearchableListGroup
											defaultOpen={index === 0}
											schema={schema}
											checkboxes={checkboxes}
											setCheckboxes={setCheckboxes}
											onChange={onChangeObjectCheckbox}
										/>
									</div>
								)
							})}
						</div>
					)}
					{error && (
						<div className="ml-8 mb-4">
							<span className="text-tertiary-red block text-xs">{error}</span>
						</div>
					)}
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
