import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllBuckets, selectBuckets } from "../../redux/slices/bucketSlice"
import BucketsPageComponent from "./Component"

function BucketsPageContainer() {
	const dispatch = useDispatch<any>()
	const buckets = useSelector(selectBuckets)
	useEffect(() => {
		dispatch(getAllBuckets())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return <BucketsPageComponent data={buckets} />
}

export default BucketsPageContainer
