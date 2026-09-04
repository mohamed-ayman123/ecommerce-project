import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import productsReducer from './slices/productsSlice'
import ordersReducer from './slices/ordersSlice'
import uiReducer from './slices/uiSlice'
import usersReducer from './slices/usersSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    orders: ordersReducer,
    ui: uiReducer,
    users: usersReducer,
  },
})

export default store
