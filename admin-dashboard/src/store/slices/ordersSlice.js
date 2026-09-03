import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  total: 0,
  page: 1,
  totalPages: 1,
  selectedOrder: null,
  filters: {
    status: '',
    paymentStatus: '',
    from: '',
    to: '',
  },
  isLoading: false,
  error: null,
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrdersLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setOrders: (state, action) => {
      state.items = action.payload.orders || []
      state.total = action.payload.total || 0
      state.page = action.payload.currentPage || 1
      state.totalPages = action.payload.totalPages || 1
      state.isLoading = false
      state.error = null
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload
    },
    setOrderFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
      state.page = 1
    },
    clearOrderFilters: (state) => {
      state.filters = { status: '', paymentStatus: '', from: '', to: '' }
      state.page = 1
    },
    setOrdersError: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    },
  },
})

export const {
  setOrdersLoading,
  setOrders,
  setSelectedOrder,
  setOrderFilter,
  clearOrderFilters,
  setOrdersError,
} = ordersSlice.actions

export default ordersSlice.reducer
