import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { updateBucketService } from "../../service/buckets"
import { BASE_API } from "../../utils/constants"
import { arrayStringDistinct } from "../../utils/object"
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
	return await fetch(`${BASE_API}/bucket/all`, {
		method: "POST",
		headers: { "content-type": "application/json" },
	}).then((response) => response.json())
})

export const updateBucket = createAsyncThunk(
	"bucket/update",
	async ({ bucket, objects }: any, thunkAPI) => {
		try {
			const data = await updateBucketService({ bucket, objects })
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
		builder.addCase(getAllBuckets.pending, (state, action) => {
			state.loading = true
		})
		builder.addCase(getAllBuckets.rejected, (state, action) => {
			state.loading = false
		})
		builder.addCase(getAllBuckets.fulfilled, (state, action) => {
			state.loading = false
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

		builder.addCase(updateBucket.fulfilled, (state, action) => {
			const { payload } = action
			const editedBucketDid = payload.did
			const addedObjects = payload.objects
			const editedBucket =
				state.list.find((bucket) => bucket.did === editedBucketDid) || []
			const editedBucketIndex = state.list.findIndex(
				(bucket) => bucket.did === editedBucketDid
			)

			if (editedBucketIndex !== -1) {
				state.list[editedBucketIndex].objects = arrayStringDistinct(
					(editedBucket as Bucket).objects.concat(addedObjects)
				)
			}
		})
	},
})

export default bucketSlice.reducer
