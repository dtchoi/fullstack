import {createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlicer = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    displayNotification(state, action) {
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

export const { displayNotification, removeNotification } = notificationSlicer.actions

export const setNotification = (message, timeout) => {
  return dispatch => {
    dispatch(displayNotification(message))
    setTimeout(() => dispatch(removeNotification(message)), timeout * 1000)
  }
}
export default notificationSlicer.reducer