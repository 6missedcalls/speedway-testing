import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { IgetSchemaFields, InewSchema, Ischema } from "../../utils/types"
import { createSchema, getAllSchemas, getSchema } from "../../service/schemas"
import { addressToDid } from "../../utils/did"

interface userCreateSchemaProp {
	schema: InewSchema
}

interface userGetSchemaProp {
	schema: IgetSchemaFields
}

export const userGetAllSchemas = createAsyncThunk(
	"schemas/getAll",
	async (address: string, thunkAPI) => {
		try {
			const data = await getAllSchemas()
			return data.what_is.filter(
				(schema: any) => schema.creator === addressToDid(address)
			)
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
	}
)

export const userCreateSchema = createAsyncThunk(
	"schemas/create",
	async ({ schema }: userCreateSchemaProp, thunkAPI) => {
		try {
			const data = await createSchema(schema)
			return data
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
	}
)

export const userGetSchema = createAsyncThunk(
	"schemas/get",
	async ({ schema }: userGetSchemaProp, thunkAPI) => {
		try {
			const data = await getSchema(schema)
			return data
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
	}
)

export interface SchemasState {
	list: Array<Ischema>
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
			const { payload } = action
			state.loading = false
			state.list = payload
		})

		builder.addCase(userGetAllSchemas.rejected, (state) => {
			state.error = true
			state.loading = false
		})
		builder.addCase(userGetSchema.pending, (state) => {
			state.getSchemaLoading = true
		})

		builder.addCase(userGetSchema.fulfilled, (state) => {
			state.getSchemaLoading = false
		})

		builder.addCase(userGetSchema.rejected, (state) => {
			state.error = true
			state.getSchemaLoading = false
		})
		builder.addCase(userCreateSchema.pending, (state) => {
			state.loading = true
		})

		builder.addCase(userCreateSchema.fulfilled, (state, action) => {
			const { payload } = action
			state.loading = false
			state.list.push({
				did: payload.whatIs.did,
				schema: {
					did: payload.whatIs.did,
					label: payload.definition.label,
				},
				creator: payload.whatIs.creator,
				is_active: true,
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
