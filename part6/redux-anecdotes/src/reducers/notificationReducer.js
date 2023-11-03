import {createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlicer = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      const notification = action.payload
      return notification
    },
    removeNotification(state, action) {
      console.log(state)
      console.log(action.payload)
      console.log( state === action.payload )
      if ( state === action.payload )
        return ''
      else
        return state
    }
  }
})

export const { setNotification, removeNotification } = notificationSlicer.actions
export default notificationSlicer.reducer