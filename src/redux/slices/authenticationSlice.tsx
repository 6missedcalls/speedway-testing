import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import login from "../../service/login"
import createAccount from "../../service/createAccount"
import buyAlias from "../../service/buyAlias"

interface loginProps {
	walletAddress: string
	password: string
}

interface createAccountProps {
	password: string
}

interface buyAliasProps {
	alias: string
}

interface AuthenticationState {
	isLogged: boolean
	loading: boolean
	error: boolean
	Address: string
	alias: string
}

export const initialState: AuthenticationState = {
	isLogged: false,
	loading: false,
	error: false,
	Address: '',
	alias: ''
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
			const address = await createAccount(password)
			return address
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
	}
)

export const userBuyAlias = createAsyncThunk(
	"authentication/buyAlias",
	async ({ alias }: buyAliasProps, thunkAPI) => {
		try {
			const data = await buyAlias(alias)
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

		builder.addCase(userLogin.fulfilled, (state, action) => {
			state.loading = false
			state.isLogged = true
			state.Address = action.payload
		})

		builder.addCase(userLogin.rejected, (state) => {
			state.error = true
			state.loading = false
		})
		builder.addCase(userCreateAccount.pending, (state) => {
			state.loading = true
		})

		builder.addCase(userCreateAccount.fulfilled, (state, action) => {
			state.loading = false
			state.Address = action.payload
		})

		builder.addCase(userCreateAccount.rejected, (state) => {
			state.error = true
			state.loading = false
		})

		builder.addCase(userBuyAlias.pending, (state) => {
			state.loading = true
		})

		builder.addCase(userBuyAlias.fulfilled, (state, action) => {
			const { meta } = action
			state.alias = meta?.arg?.alias
			state.loading = false
		})

		builder.addCase(userBuyAlias.rejected, (state) => {
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

export const selectAuthenticationIsLoading = (state: RootState) => {
	return state.authentication.loading
}

export const selectAddress = (state: RootState) => {
	return state.authentication.Address
}

export const selectAlias = (state: RootState) => {
	return state.authentication.alias
}

export default authenticationSlice.reducer
