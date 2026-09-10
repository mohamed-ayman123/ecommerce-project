import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import {
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
} from '@/api/orders'
import {
  buildStoreCatalogLookup,
  isStoreOrder,
  filterStoreOrder,
} from '@/utils/storeCatalog'

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
      const errorMessage =
        err.response?.data?.errors?.join?.(', ') ||
        err.response?.data?.message ||
        err.message ||
        'Failed to update order status'
      return rejectWithValue(errorMessage)
    }
  }
)


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

// ==========================================
// Order Domain Selectors
// ==========================================

/**
 * Nexis Tech Store Orders & Revenue Statistics Selector
 * Pure domain-level selector calculating real electronics orders, statuses, revenues, and top products.
 */
export const selectStoreOrderStats = createSelector(
  [
    (state) => state.orders?.items || [],
    (state) => state.products?.items || [],
    (state) => Boolean(state.orders?.isLoading),
  ],
  (orders, products, isLoading) => {
    const lookup = buildStoreCatalogLookup(products)

    // Filter orders to Nexis Tech Electronics & recalculate accurate prices
    const storeOrders = orders
      .filter((order) => isStoreOrder(order, lookup))
      .map((order) => filterStoreOrder(order, lookup))

    const statusCounts = {
      pending: 0,
      processing: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0,
    }

    let totalRevenue = 0
    let deliveredRevenue = 0
    let thisMonthRevenue = 0

    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    const productSalesMap = new Map()

    storeOrders.forEach((order) => {
      const rawStatus = (order.status || 'pending').toLowerCase()
      if (Object.prototype.hasOwnProperty.call(statusCounts, rawStatus)) {
        statusCounts[rawStatus] += 1
      } else {
        statusCounts[rawStatus] = 1
      }

      const orderTotal = Number(order.totalPrice || order.total) || 0
      const isCancelled = rawStatus === 'cancelled' || rawStatus === 'returned'

      // Delivered revenue = actual realized revenue
      if (rawStatus === 'delivered') {
        deliveredRevenue += orderTotal
      }

      // Gross revenue from valid orders (excluding cancelled / returned)
      if (!isCancelled) {
        totalRevenue += orderTotal

        // Check if created within current month
        if (order.createdAt) {
          const orderDate = new Date(order.createdAt)
          if (
            !Number.isNaN(orderDate.getTime()) &&
            orderDate.getFullYear() === currentYear &&
            orderDate.getMonth() === currentMonth
          ) {
            thisMonthRevenue += orderTotal
          }
        }
      }

      // Aggregate item sales for top products ranking
      if (!isCancelled && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const prodId = String(item.product?._id || item.product || item.name || '')
          const prodName = item.name || item.title || 'Electronics Product'
          const prodImage = item.image || item.product?.image || ''
          const qty = Number(item.quantity) || 1
          const itemRev = (Number(item.price) || 0) * qty

          if (!productSalesMap.has(prodId)) {
            productSalesMap.set(prodId, {
              _id: prodId,
              name: prodName,
              image: prodImage,
              totalSold: 0,
              revenue: 0,
            })
          }

          const existing = productSalesMap.get(prodId)
          existing.totalSold += qty
          existing.revenue += itemRev
          if (!existing.image && prodImage) {
            existing.image = prodImage
          }
        })
      }
    })

    // Sort and rank top 10 best-selling electronics
    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.totalSold - a.totalSold || b.revenue - a.revenue)
      .slice(0, 10)

    // Sort recent orders (newest first)
    const recentOrders = [...storeOrders]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5)

    return {
      totalOrders: storeOrders.length,
      pendingOrders: statusCounts.pending,
      processingOrders: statusCounts.processing,
      confirmedOrders: statusCounts.confirmed,
      shippedOrders: statusCounts.shipped,
      deliveredOrders: statusCounts.delivered,
      cancelledOrders: statusCounts.cancelled,
      returnedOrders: statusCounts.returned,
      statusCounts,
      ordersByStatus: Object.entries(statusCounts).map(([status, count]) => ({
        _id: status,
        count,
      })),
      totalRevenue: Number(totalRevenue.toFixed(2)),
      deliveredRevenue: Number(deliveredRevenue.toFixed(2)),
      thisMonthRevenue: Number(thisMonthRevenue.toFixed(2)),
      topProduct: topProducts[0] || { name: '—', totalSold: 0, revenue: 0 },
      topProducts,
      recentOrders,
      isOrdersLoading: isLoading,
    }
  }
)

export default ordersSlice.reducer
