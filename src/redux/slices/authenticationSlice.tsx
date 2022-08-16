import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { createAccount, login } from "../../service/authentication"

export interface AuthenticationState {
	isLogged: boolean
	loading: boolean
	error: boolean
	Address: string
}

interface loginProps {
	walletAddress: string
	password: string
}

interface createAccountProps {
	password: string
}

const initialState: AuthenticationState = {
	isLogged: false,
	loading: false,
	error: false,
	Address: "",
}

export const userLogin = createAsyncThunk(
	"authentication/login",
	async ({ walletAddress, password }: loginProps, thunkAPI) => {
		try {
			const data = await login(walletAddress, password)
			return data
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
	}
)

export const userCreateAccount = createAsyncThunk(
	"authentication/createAccount",
	async ({ password }: createAccountProps, thunkAPI) => {
		try {
			const data = await createAccount(password)
			return data
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
	}
)

export const authenticationSlice = createSlice({
	name: "authentication",
	initialState,
	reducers: {
		setIsLogged: (state, action: PayloadAction<boolean>) => {
			state.isLogged = action.payload
		},
	},
	extraReducers: (builder) => {
		builder.addCase(userLogin.pending, (state) => {
			state.loading = true
		})

		builder.addCase(userLogin.fulfilled, (state) => {
			state.loading = false
			state.isLogged = true
		})

		builder.addCase(userLogin.rejected, (state) => {
			state.error = true
			state.loading = false
		})
		builder.addCase(userCreateAccount.pending, (state) => {
			state.loading = true
		})

		builder.addCase(userCreateAccount.fulfilled, (state, action) => {
			const { payload } = action
			state.loading = false
			state.Address = payload.Address
		})

		builder.addCase(userCreateAccount.rejected, (state) => {
			state.error = true
			state.loading = false
		})
	},
})

export const { setIsLogged } = authenticationSlice.actions

export const selectIsLogged = (state: RootState) => {
	return state.authentication.isLogged
}

export const selectLoginError = (state: RootState) => {
	return state.authentication.error
}

export const selectAddress = (state: RootState) => {
	return state.authentication.Address
}

export default authenticationSlice.reducer
