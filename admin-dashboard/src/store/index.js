import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import productsReducer from './slices/productsSlice'
import ordersReducer from './slices/ordersSlice'
import uiReducer from './slices/uiSlice'
import usersReducer from './slices/usersSlice'
import cartsReducer from './slices/cartsSlice'
import dashboardReducer from './slices/dashboardSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    orders: ordersReducer,
    ui: uiReducer,
    users: usersReducer,
    carts: cartsReducer,
    dashboard: dashboardReducer,
  },
})

export default store
