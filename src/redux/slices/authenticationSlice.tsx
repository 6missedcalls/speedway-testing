import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

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

// Action creators are generated for each case reducer function
export const { setIsLogged } = authenticationSlice.actions

export default authenticationSlice.reducer