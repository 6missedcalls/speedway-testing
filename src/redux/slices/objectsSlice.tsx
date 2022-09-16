import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import createObject from "../../service/createObject"
import getObjectsFromBucket from "../../service/getObjectsFromBucket"
import { isFulfilled, promiseAllSettledLogErrors } from "../../utils/promise"
import { InewObject, SonrObject } from "../../utils/types"
import { RootState } from "../store"

export interface ObjectsState {
	list: Array<SonrObject>
	loading: boolean
	error: boolean
}

export const initialState: ObjectsState = {
	list: [],
	loading: false,
	error: false,
}

export const userCreateObject = createAsyncThunk(
	"objects/create",
	async ({ schemaDid, object, label }: InewObject, thunkAPI) => {
		try {
			const cid = await createObject(schemaDid, object, label)
			return cid
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

export const userGetBucketObjects = createAsyncThunk(
	"bucket/content",
	async ({ bucketDid }: { bucketDid: string }, thunkAPI) => {
		try {
			return await getObjectsFromBucket(bucketDid)
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
	}
)

export const objectsSlice = createSlice({
	name: "objects",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(userCreateObject.pending, (state) => {
			state.loading = true
		})

		builder.addCase(userCreateObject.fulfilled, (state) => {
			state.loading = false
		})

		builder.addCase(userCreateObject.rejected, (state) => {
			state.error = true
			state.loading = false
		})

		builder.addCase(userGetAllObjects.pending, (state) => {
			state.loading = true
		})

		builder.addCase(userGetAllObjects.fulfilled, (state, action) => {
			const { payload } = action
			state.loading = false
			state.list = payload
		})

		builder.addCase(userGetAllObjects.rejected, (state) => {
			state.error = true
			state.loading = false
		})

		builder.addCase(userGetBucketObjects.pending, (state) => {
			state.loading = true
		})

		builder.addCase(userGetBucketObjects.fulfilled, (state, action) => {
			const { payload } = action
			state.loading = false
			state.list = payload
		})

		builder.addCase(userGetBucketObjects.rejected, (state) => {
			state.error = true
			state.loading = false
		})
	},
})

export const selectObjectsLoading = (state: RootState) => {
	return state.objects.loading
}

export const selectObjectsError = (state: RootState) => {
	return state.objects.error
}

export const selectObjectsList = (state: RootState) => {
	return state.objects.list
}

export default objectsSlice.reducer
