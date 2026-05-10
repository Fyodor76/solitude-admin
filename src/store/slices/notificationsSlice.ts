import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type NotificationType = 'success' | 'info' | 'warning' | 'error'

export type AppNotification = {
  type: NotificationType
  message: string
  duration?: number | false
}

type NotificationsState = {
  items: AppNotification[]
}

const initialState: NotificationsState = {
  items: [],
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<AppNotification[]>) => {
      state.items = action.payload
    },
    clearNotifications: state => {
      state.items = []
    },
  },
})

export const { addNotification, clearNotifications } = notificationsSlice.actions

export default notificationsSlice.reducer
