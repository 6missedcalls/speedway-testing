import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface AuthenticationState {
  isLogged: boolean
}

const initialState: AuthenticationState = {
  isLogged: false,
}

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setIsLogged: (state, action: PayloadAction<boolean>) => {
      state.isLogged = action.payload
    },
  },
})

export const { setIsLogged } = authenticationSlice.actions

export const selectIsLogged = ((state: RootState) => state.authentication.isLogged)

export default authenticationSlice.reducer