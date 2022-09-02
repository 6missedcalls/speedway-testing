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

export const selectBucketsError = (state: RootState) => {
	return state.bucket.error
}

export const getAllBuckets = createAsyncThunk(
	"bucket/getAll",
	async (address: string) => {
		return await fetch("http://localhost:4040/proxy/buckets", {
			method: "GET",
			headers: { "content-type": "application/json" },
		})
			.then((response) => response.json())
			.then((response) =>
				response.where_is
					.filter((bucket: Bucket) => bucket.creator === address)
					.map((bucket: Bucket) => ({
						did: bucket.did,
						label: bucket.label,
						content: bucket.content.filter((c) => c.uri),
					}))
			)
	}
)

export const updateBucket = createAsyncThunk(
	"bucket/update-items",
	async ({ bucketDid, objectCid, objectName, schemaDid }: any, thunkAPI) => {
		try {
			const data = await updateBucketService({
				bucketDid,
				objectCid,
				objectName,
				schemaDid,
			})
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
	error: boolean
}
export const initialState: BucketState = {
	list: [],
	creating: false,
	loading: false,
	error: false,
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
			state.error = true
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
			state.error = true
		})
		builder.addCase(createBucket.fulfilled, (state) => {
			state.creating = false
		})

		builder.addCase(updateBucket.pending, (state) => {
			state.loading = true
		})
		builder.addCase(updateBucket.rejected, (state) => {
			state.loading = false
			state.error = true
		})
		builder.addCase(updateBucket.fulfilled, (state) => {
			state.loading = false
		})
	},
})

export default bucketSlice.reducer
