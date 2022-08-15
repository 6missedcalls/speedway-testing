import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { login } from "../../service/authentication"

export interface AuthenticationState {
	isLogged: boolean
	loading: boolean
	error?: string
}

interface loginProps {
	walletAddress: string
	password: string
}

const initialState: AuthenticationState = {
	isLogged: false,
	loading: false
}

export const userLogin = createAsyncThunk(
	'authentication/login',
	async ({walletAddress, password}: loginProps) => {
	  const response = await login(walletAddress, password)
	  return response.data
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
		  state.loading = true;
		});
	
		builder.addCase(userLogin.fulfilled, (state) => {
		  state.loading = false;
		  state.isLogged = true;
		});
	
		builder.addCase(userLogin.rejected, (state) => {
		  state.error = 'Login failed.';
		  state.loading = false;
		});
	  },
})

export const { setIsLogged } = authenticationSlice.actions

export const selectIsLogged = (state: RootState) =>{
	console.log('state!', state)
	return state.authentication.isLogged
}

export default authenticationSlice.reducer
