import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import createObject from "../../service/createObject"
import getObject from "../../service/getObject"
import getObjectsFromBucket from "../../service/getObjectsFromBucket"
import { replaceFileBase64StringOnObjectList } from "../../utils/mappings"
import { InewObject, SonrObject, userGetObjectProps } from "../../utils/types"
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

export const userGetObject = createAsyncThunk(
	"object/get",
	async ({ schemaDid, objectCid }: userGetObjectProps, thunkAPI) => {
		try {
			return await getObject({ schemaDid, objectCid })
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
		builder.addCase(userGetObject.pending, (state) => {
			state.loading = true
		})

		builder.addCase(userGetObject.fulfilled, (state) => {
			state.loading = false
		})

		builder.addCase(userGetObject.rejected, (state) => {
			state.error = true
			state.loading = false
		})

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

		builder.addCase(userGetBucketObjects.pending, (state) => {
			state.loading = true
		})

		builder.addCase(userGetBucketObjects.fulfilled, (state, action) => {
			const { payload } = action
			const list = replaceFileBase64StringOnObjectList(payload)
			state.list = list
			state.loading = false
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
