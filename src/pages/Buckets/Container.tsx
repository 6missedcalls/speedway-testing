import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectAddress } from "../../redux/slices/authenticationSlice"
import {
	getAllBuckets,
	selectBuckets,
	selectBucketsLoading,
} from "../../redux/slices/bucketSlice"
import { AppDispatch } from "../../redux/store"
import BucketsPageComponent from "./Component"

function BucketsPageContainer() {
	const dispatch = useDispatch<AppDispatch>()
	const buckets = useSelector(selectBuckets)
	const loading = useSelector(selectBucketsLoading)
	const address = useSelector(selectAddress)
	useEffect(() => {
		dispatch(getAllBuckets(address))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return <BucketsPageComponent data={buckets} loading={loading} />
}

export default BucketsPageContainer
