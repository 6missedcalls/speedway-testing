import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { Ischema } from "../../utils/types"
import { createSchema, getAllSchemas } from "../../service/schemas"

export interface SchemasState {
	list: Array<Ischema>
	loading: boolean
	error: boolean
}

const initialState: SchemasState = {
	list: [],
	loading: false,
	error: false,
}

export const userGetAllSchemas = createAsyncThunk(
	"schemas/getAll",
	async (_, thunkAPI) => {
		try {
			const data = await getAllSchemas()
			return data
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
	}
)

export const userCreateSchema = createAsyncThunk(
	"schemas/create",
	async (schema: Ischema, thunkAPI) => {
		try {
			const data = await createSchema(schema)
			return data
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
	}
)

export const schemasSlice = createSlice({
	name: "schemas",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(userGetAllSchemas.pending, (state) => {
			state.loading = true
		})

		builder.addCase(userGetAllSchemas.fulfilled, (state, action) => {
			const { payload } = action
			state.loading = false
			state.list = payload
		})

		builder.addCase(userGetAllSchemas.rejected, (state) => {
			state.error = true
			state.loading = false
		})
		builder.addCase(userCreateSchema.pending, (state) => {
			state.loading = true
		})

		builder.addCase(userCreateSchema.fulfilled, (state, action) => {
			const { payload } = action
			state.loading = false
			state.list.push(payload)
		})

		builder.addCase(userCreateSchema.rejected, (state) => {
			state.error = true
			state.loading = false
		})
	},
})

export const selectSchemasMetaDataList = (state: RootState) => {
	return state.schemas.list
}

export default schemasSlice.reducer
