import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
	getAllBuckets,
	selectBuckets,
	selectBucketsLoading,
} from "../../redux/slices/bucketSlice"
import BucketsPageComponent from "./Component"

function BucketsPageContainer() {
	const dispatch = useDispatch<any>()
	const buckets = useSelector(selectBuckets)
	const loading = useSelector(selectBucketsLoading)
	useEffect(() => {
		dispatch(getAllBuckets())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return <BucketsPageComponent data={buckets} loading={loading} />
}

export default BucketsPageContainer
