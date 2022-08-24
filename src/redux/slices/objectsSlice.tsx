import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { createObject, getBucketContent } from "../../service/objects"
import { arrayObjectDistinct, arrayStringDistinct } from "../../utils/object"
import { InewObject } from "../../utils/types"
import { RootState } from "../store"

export interface ObjectsState {
	list: Array<any>
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
	async ({ schemaDid, label, object }: InewObject, thunkAPI) => {
		try {
			const data = await createObject({ schemaDid, label, object })
			return data
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
	}
)

export const userGetBucketObjects = createAsyncThunk(
	"bucket/content",
	async ({ bucket }: any, thunkAPI) => {
		try {
			const data = await getBucketContent({ bucket })
			return data
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

		builder.addCase(userGetBucketObjects.pending, (state) => {
			state.loading = true
		})
		builder.addCase(userGetBucketObjects.fulfilled, (state, action) => {
			const { payload } = action
			if(payload.length > 0){
				state.list = arrayObjectDistinct(state.list.concat(payload), 'cid')
			}
			state.loading = false
		})
		builder.addCase(userGetBucketObjects.rejected, (state, action) => {
			state.loading = false
		})
	},
})

export const selectObjectsLoading = (state: RootState) => {
	return state.objects.loading
}

export const selectObjectsList = (state: RootState) => {
	return state.objects.list
}

export default objectsSlice.reducer
