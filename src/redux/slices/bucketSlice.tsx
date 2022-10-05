import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import addObjectToBucket from "../../service/addObjectToBucket"
import createBucket from "../../service/createBucket"
import getBuckets from "../../service/getBuckets"
import getObjectsFromBucket from "../../service/getObjectsFromBucket"
import { isFulfilled, promiseAllSettledLogErrors } from "../../utils/promise"
import { Bucket, SonrObject, updateBucketProps } from "../../utils/types"
import { RootState } from "../store"

export const selectBuckets = (state: RootState) => {
	return state.bucket.list
}

export const selectAllObjects = (state: RootState) => {
	return state.bucket.allObjectsList
}

export const selectAllObjectsLoading = (state: RootState) => {
	return state.bucket.allObjectsLoading
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
			const data: Bucket[] = await getBuckets(address)
			return data
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
	}
)

export const updateBucket = createAsyncThunk(
	"bucket/update-items",
	async ({ bucketDid, objectCid, schemaDid }: updateBucketProps, thunkAPI) => {
		try {
			await addObjectToBucket(bucketDid, schemaDid, objectCid)
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
	}
)

export const userCreateBucket = createAsyncThunk(
	"bucket/create",
	async (
		{
			label,
			address,
			content,
		}: { label: string; address: string; content?: Array<any> },
		thunkAPI
	) => {
		try {
			await createBucket(label, address, content)
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
	}
)

export const userGetAllObjects = createAsyncThunk(
	"bucket/all/content",
	async ({ bucketDids }: { bucketDids: Array<string> }, thunkAPI) => {
		try {
			const results = await Promise.allSettled(
				bucketDids.map((did) => getObjectsFromBucket(did))
			)
			promiseAllSettledLogErrors(results)

			const bucketObjects = results
				.filter(isFulfilled)
				.map((item) => item.value)

			return bucketObjects.flat()
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
	}
)

export type BucketState = {
	list: Bucket[]
	allObjectsList: SonrObject[]
	creating: boolean
	loading: boolean
	allObjectsLoading: boolean
	error: boolean
}
export const initialState: BucketState = {
	list: [],
	allObjectsList: [],
	creating: false,
	loading: false,
	allObjectsLoading: false,
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
			state.list = action.payload
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

		builder.addCase(userGetAllObjects.pending, (state) => {
			state.allObjectsLoading = true
		})

		builder.addCase(userGetAllObjects.fulfilled, (state, action) => {
			const { payload } = action
			state.allObjectsLoading = false
			state.allObjectsList = payload
		})

		builder.addCase(userGetAllObjects.rejected, (state) => {
			state.error = true
			state.allObjectsLoading = false
		})
	},
})

export default bucketSlice.reducer
