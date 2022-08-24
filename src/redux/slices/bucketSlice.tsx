import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { updateBucketService } from "../../service/buckets"
import { BASE_API } from "../../utils/constants"
import { arrayStringDistinct } from "../../utils/object"
import { Bucket, NewBucketPayload } from "../../utils/types"
import { RootState } from "../store"

export const selectBuckets = (state: RootState) => {
	return state.bucket.list
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

		builder.addCase(updateBucket.fulfilled, (state, action) => {
			const { payload } = action
			const editedBucketDid = payload.did
			const addedObjects = payload.objects
			const editedBucket: any =
				state.list.find((bucket) => bucket.did === editedBucketDid) || []
			const editedBucketIndex = state.list.findIndex(
				(bucket) => bucket.did === editedBucketDid
			)

			if (editedBucketIndex !== -1) {
				state.list[editedBucketIndex].objects = arrayStringDistinct(
					editedBucket.objects.concat(addedObjects)
				)
			}
		})
	},
})

export default bucketSlice.reducer
