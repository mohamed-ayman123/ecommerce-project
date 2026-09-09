import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
  getDashboardStats,
} from '@/api/orders'

// Async Thunks
export const fetchAdminOrders = createAsyncThunk(
  'orders/fetchAdminOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await getAdminOrders(params)
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch orders'
      )
    }
  }
)

export const fetchAdminOrderById = createAsyncThunk(
  'orders/fetchAdminOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await getAdminOrderById(id)
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch order details'
      )
    }
  }
)

export const changeOrderStatus = createAsyncThunk(
  'orders/changeOrderStatus',
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      const data = await updateOrderStatus(id, statusData)
      return { id, data, statusData }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to update order status'
      )
    }
  }
)

export const fetchDashboardStats = createAsyncThunk(
  'orders/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getDashboardStats()
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch dashboard stats'
      )
    }
  }
)

const initialState = {
  items: [],
  total: 0,
  page: 1,
  totalPages: 1,
  selectedOrder: null,
  dashboardStats: null,
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
      const payload = action.payload || {}
      state.items = payload.orders || (Array.isArray(payload) ? payload : [])
      state.total = payload.total || state.items.length
      state.page = payload.currentPage || 1
      state.totalPages = payload.totalPages || 1
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
  extraReducers: (builder) => {
    builder
      // fetchAdminOrders
      .addCase(fetchAdminOrders.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.isLoading = false
        const payload = action.payload || {}
        state.items = payload.orders || (Array.isArray(payload) ? payload : [])
        state.total = payload.total || state.items.length
        state.page = payload.currentPage || payload.page || 1
        state.totalPages = payload.totalPages || 1
        state.error = null
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // fetchAdminOrderById
      .addCase(fetchAdminOrderById.fulfilled, (state, action) => {
        state.selectedOrder = action.payload?.order || action.payload
      })

      // changeOrderStatus
      .addCase(changeOrderStatus.fulfilled, (state, action) => {
        const { id, data, statusData } = action.payload
        const updatedOrder = data?.order || data
        const newStatus = updatedOrder?.status || statusData?.status

        // Update in items list
        const idx = state.items.findIndex(
          (item) => (item._id || item.id) === id
        )
        if (idx !== -1) {
          if (updatedOrder && typeof updatedOrder === 'object') {
            state.items[idx] = { ...state.items[idx], ...updatedOrder }
          } else if (newStatus) {
            state.items[idx] = { ...state.items[idx], status: newStatus }
          }
        }

        // Update selectedOrder if it matches
        if (
          state.selectedOrder &&
          (state.selectedOrder._id || state.selectedOrder.id || state.selectedOrder.originalId) === id
        ) {
          state.selectedOrder = {
            ...state.selectedOrder,
            ...(updatedOrder || {}),
            status: newStatus || state.selectedOrder.status,
          }
        }
      })

      // fetchDashboardStats
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardStats = action.payload
      })
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
