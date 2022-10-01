import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { InewSchema, SchemaMeta } from "../../utils/types"
import getSchemas from "../../service/getSchemas"
import createSchema from "../../service/createSchema"

export const userGetAllSchemas = createAsyncThunk(
	"schemas/getAll",
	async (address: string, thunkAPI) => {
		try {
			const data = await getSchemas(address)
			return data
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
	}
)

export const userCreateSchema = createAsyncThunk(
	"schemas/create",
	async ({ schema }: { schema: InewSchema }, thunkAPI) => {
		try {
			const data = await createSchema(schema.label, schema.fields)
			return data
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
	}
)

export interface SchemasState {
	list: Array<SchemaMeta>
	loading: boolean
	getSchemaLoading: boolean
	error: boolean
}
export const initialState: SchemasState = {
	list: [],
	loading: false,
	error: false,
	getSchemaLoading: false,
}
export const schemasSlice = createSlice({
	name: "schemas",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(userGetAllSchemas.pending, (state) => {
			state.loading = true
		})

		builder.addCase(userGetAllSchemas.fulfilled, (state, action) => {
			state.loading = false
			state.list = action.payload
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
			state.list.push({
				did: payload.did,
				label: payload.label,
				fields: payload.fields,
			})
		})
		builder.addCase(userCreateSchema.rejected, (state) => {
			state.error = true
			state.loading = false
		})
	},
})

export const selectSchemasLoading = (state: RootState) => {
	return state.schemas.loading
}

export const selectGetSchemaLoading = (state: RootState) => {
	return state.schemas.getSchemaLoading
}

export const selectSchemasError = (state: RootState) => {
	return state.schemas.error
}

export const selectSchemasMetadataList = (state: RootState) => {
	return state.schemas.list
}

export default schemasSlice.reducer
