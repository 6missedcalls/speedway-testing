import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { BASE_API } from "../../utils/constants"
import { Bucket, NewBucketPayload } from "../../utils/types"
import { RootState } from "../store"

export const selectBuckets = (state: RootState) => {
	return state.bucket.list
}

export const getAllBuckets = createAsyncThunk("buckets/getAll", async () => {
	return await fetch(`${BASE_API}/bucket/all`, {
		method: "POST",
		headers: { "content-type": "application/json" },
	}).then((response) => response.json())
})

export const createBucket = createAsyncThunk(
	"bucket/create",
	async (bucket: NewBucketPayload) => {
		return await fetch(`${BASE_API}/bucket/create`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(bucket),
		}).then((response) => response.json())
	}
)

export type BucketState = {
	list: Bucket[]
}
export const initialState: BucketState = {
	list: [],
}
const bucketSlice = createSlice({
	name: "bucket",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getAllBuckets.fulfilled, (state, action) => {
			state.list = action.payload.data
		})

		builder.addCase(createBucket.fulfilled, (state, action) => {
			state.list.push(action.payload)
		})
	},
})
export default bucketSlice.reducer
