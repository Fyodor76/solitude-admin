import '@/shared/lib/api/admin-notifications/adminNotificationsApi'
import { baseApi } from '@/shared/lib/api/baseApi'
import '@/shared/lib/api/support/supportApi'
import { rtkQueryErrorMiddleware } from '@/store/middleware/rtkQueryErrorMiddleware'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import notificationsReducer from '../../store/slices/notificationsSlice'
import testSliceReducer from './slices/testSlice'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    todos: testSliceReducer,
    notifications: notificationsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(baseApi.middleware).concat(rtkQueryErrorMiddleware),
})
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
