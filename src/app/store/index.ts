import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { categoriesApi } from '../components/ui/getCategories'
import { baseApi } from './api/baseApi'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(baseApi.middleware).concat(categoriesApi.middleware),
})
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
