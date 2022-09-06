import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import addObjectToBucket from "../../service/addObjectToBucket"
import createBucket from "../../service/createBucket"
import getBuckets from "../../service/getBuckets"
import { Bucket } from "../../utils/types"
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

export const userGetAllBuckets = createAsyncThunk(
	"bucket/getAll",
	async (address: string, thunkAPI) => {
		try {
			const data = await getBuckets({ address })
			return data
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
	}
)

export const updateBucket = createAsyncThunk(
	"bucket/update-items",
	async ({ bucketDid, objectCid, schemaDid }: any, thunkAPI) => {
		try {
			await addObjectToBucket({
				bucketDid,
				objectCid,
				schemaDid,
			})
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
	}
)

export const userCreateBucket = createAsyncThunk(
	"bucket/create",
	async ({ label, address }: { label: string; address: string }, thunkAPI) => {
		try {
			await createBucket({ label, address })
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
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
		builder.addCase(userGetAllBuckets.pending, (state) => {
			state.loading = true
		})
		builder.addCase(userGetAllBuckets.rejected, (state) => {
			state.loading = false
			state.error = true
		})
		builder.addCase(userGetAllBuckets.fulfilled, (state, action) => {
			state.loading = false
			state.list = action.payload.buckets
		})

		builder.addCase(userCreateBucket.pending, (state) => {
			state.creating = true
		})
		builder.addCase(userCreateBucket.rejected, (state) => {
			state.creating = false
			state.error = true
		})
		builder.addCase(userCreateBucket.fulfilled, (state) => {
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
