import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { BASE_API } from "../../utils/constants"
import { Bucket, NewBucketPayload } from "../../utils/types"
import { RootState } from "../store"

export const selectBuckets = (state: RootState) => {
	return state.bucket.list
}

export const selectBucketCreationLoading = (state: RootState) => {
	return state.bucket.creating
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
	creating: boolean
}
export const initialState: BucketState = {
	list: [],
	creating: false,
}
const bucketSlice = createSlice({
	name: "bucket",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getAllBuckets.fulfilled, (state, action) => {
			state.list = action.payload.data
		})

		builder.addCase(createBucket.pending, (state, action) => {
			state.creating = true
		})
		builder.addCase(createBucket.rejected, (state, action) => {
			state.creating = false
		})
		builder.addCase(createBucket.fulfilled, (state, action) => {
			state.creating = false
			state.list.push(action.payload)
		})
	},
})
export default bucketSlice.reducer
