import { createSlice } from '@reduxjs/toolkit'

const initialState = false

const successSlice = createSlice({
  name: 'success',
  initialState,
  reducers: {
    successChange(state, action) {
      const success = action.payload
      return success
    }
  }
})

export const { successChange } = successSlice.actions
export default successSlice.reducer