import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { updateBucketService } from "../../service/buckets"
import { BASE_API } from "../../utils/constants"
import { Bucket, NewBucketPayload } from "../../utils/types"
import { RootState } from "../store"

export const selectBuckets = (state: RootState) => {
	return state.bucket.list
}

export const selectBucketCreationLoading = (state: RootState) => {
	return state.bucket.creating
}

export const selectBucketsLoading = (state: RootState) => {
	return state.bucket.loading
}

export const getAllBuckets = createAsyncThunk("bucket/getAll", async () => {
	return await fetch("http://localhost:8080/proxy/buckets", {
		method: "GET",
		headers: { "content-type": "application/json" },
	})
		.then((response) => response.json())
		.then((r) =>
			r.where_is.map((bucket: Bucket) => ({
				did: bucket.did,
				label: bucket.label,
				content: bucket.content.filter((c) => c.uri),
			}))
		)
})

export const updateBucket = createAsyncThunk(
	"bucket/update",
	async ({ bucketDid, objectCid }: any, thunkAPI) => {
		try {
			const data = await updateBucketService({ bucketDid, objectCid })
			return data
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
	}
)

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
	loading: boolean
}
export const initialState: BucketState = {
	list: [],
	creating: false,
	loading: false,
}
const bucketSlice = createSlice({
	name: "bucket",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getAllBuckets.pending, (state) => {
			state.loading = true
		})
		builder.addCase(getAllBuckets.rejected, (state) => {
			state.loading = false
		})
		builder.addCase(getAllBuckets.fulfilled, (state, action) => {
			state.loading = false
			state.list = action.payload
		})

		builder.addCase(createBucket.pending, (state) => {
			state.creating = true
		})
		builder.addCase(createBucket.rejected, (state) => {
			state.creating = false
		})
		builder.addCase(createBucket.fulfilled, (state) => {
			state.creating = false
		})
	},
})

export default bucketSlice.reducer
