import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { createObject } from "../../service/objects"
import { InewObject } from "../../utils/types"
import { RootState } from "../store"

export interface ObjectsState {
	list: Array<any>
	loading: boolean
	error: boolean
}

const initialState: ObjectsState = {
	list: [],
	loading: false,
	error: false,
}

export const userGetAllObjects = createAsyncThunk(
	"objects/getAll",
	async (_, thunkAPI) => {
		try {
			return []
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
	}
)

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

export const objectsSlice = createSlice({
	name: "objects",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
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
		builder.addCase(userCreateObject.pending, (state) => {
			state.loading = true
		})

		builder.addCase(userCreateObject.fulfilled, (state, action) => {
			const { payload } = action
			state.loading = false
			//state.list.push(payload)
		})

		builder.addCase(userCreateObject.rejected, (state) => {
			state.error = true
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
