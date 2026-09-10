import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { getDashboardStats } from '@/api/orders'
import { fetchAdminOrders, selectStoreOrderStats } from './ordersSlice'
import { fetchAdminCarts, selectStoreCartStats } from './cartsSlice'
import { fetchProducts, selectProductStats } from './productsSlice'
import { fetchUsers, selectUserStats } from './usersSlice'

/**
 * ============================================================================
 * Async Thunk: Fetch Raw Platform Dashboard Statistics
 * ============================================================================
 * Calls GET /orders/admin/dashboard for platform-wide metrics (instructor demo view).
 */
export const fetchPlatformDashboardStats = createAsyncThunk(
  'dashboard/fetchPlatformDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getDashboardStats()
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch platform dashboard stats'
      )
    }
  }
)

/**
 * ============================================================================
 * Async Thunk: Fetch All Dashboard Data (Unified Orchestrator)
 * ============================================================================
 * Dispatches all required collections in parallel so components only need 1 action.
 */
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (args = {}, { dispatch, getState }) => {
    const force = Boolean(args?.force)
    const state = getState()
    const promises = []

    // 1. Platform-wide raw stats (only if missing or forced)
    if (force || !state.dashboard?.platformStats) {
      promises.push(dispatch(fetchPlatformDashboardStats()))
    }

    // 2. Orders collection (only if empty or forced)
    if (force || !state.orders?.items?.length) {
      promises.push(dispatch(fetchAdminOrders({ limit: 100 })))
    }

    // 3. Products collection (only if empty or forced)
    if (force || !state.products?.items?.length) {
      promises.push(dispatch(fetchProducts({ limit: 100 })))
    }

    // 4. Active carts collection (only if empty or forced)
    if (force || !state.carts?.items?.length) {
      promises.push(dispatch(fetchAdminCarts()))
    }

    // 5. Users collection (only if empty or forced)
    if (force || !state.users?.items?.length) {
      promises.push(dispatch(fetchUsers()))
    }

    if (promises.length > 0) {
      await Promise.allSettled(promises)
    }
  }
)


const initialState = {
  platformStats: null,
  scope: 'store', // 'store' | 'platform'
  isLoading: false,
  error: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardScope: (state, action) => {
      state.scope = action.payload
    },
    clearDashboardError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlatformDashboardStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPlatformDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false
        const payload = action.payload || {}
        state.platformStats = payload.dashboard || payload
        state.error = null
      })
      .addCase(fetchPlatformDashboardStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // fetchDashboardData (unified)
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDashboardData.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { setDashboardScope, clearDashboardError } = dashboardSlice.actions

// ============================================================================
// Dashboard Selectors
// ============================================================================

/**
 * Selector to get current dashboard scope ('store' | 'platform')
 */
export const selectDashboardScope = (state) => state.dashboard?.scope || 'store'

/**
 * Platform Dashboard Statistics Selector (Raw Backend API)
 * Formats data from state.dashboard.platformStats
 */
export const selectPlatformDashboardStats = createSelector(
  [
    (state) => state.dashboard?.platformStats,
    (state) => Boolean(state.dashboard?.isLoading),
    (state) => state.dashboard?.error || null,
  ],
  (raw, isLoading, error) => {
    const d = raw?.dashboard || raw || {}
    const orders = d.orders || {}
    const revenue = d.revenue || {}
    const topProducts = Array.isArray(d.topProducts) ? d.topProducts : []
    const recentOrders = Array.isArray(d.recentOrders) ? d.recentOrders : []

    return {
      totalOrders: Number(orders.total) || 0,
      pendingOrders: Number(orders.pending) || 0,
      processingOrders: Number(orders.processing) || 0,
      confirmedOrders: Number(orders.confirmed) || 0,
      shippedOrders: Number(orders.shipped) || 0,
      deliveredOrders: Number(orders.delivered) || 0,
      cancelledOrders: Number(orders.cancelled) || 0,
      statusCounts: {
        pending: Number(orders.pending) || 0,
        processing: Number(orders.processing) || 0,
        confirmed: Number(orders.confirmed) || 0,
        shipped: Number(orders.shipped) || 0,
        delivered: Number(orders.delivered) || 0,
        cancelled: Number(orders.cancelled) || 0,
      },
      totalRevenue: Number(revenue.total) || 0,
      thisMonthRevenue: Number(revenue.thisMonth) || 0,
      lastMonthRevenue: Number(revenue.lastMonth) || 0,
      growthPercent: Number(revenue.growthPercent) || 0,
      totalCustomers: Number(d.totalCustomers) || 0,
      topProduct: topProducts[0] || { name: '—', totalSold: 0, revenue: 0 },
      topProducts,
      recentOrders,
      ordersByStatus: Array.isArray(d.ordersByStatus) ? d.ordersByStatus : [],
      dailyRevenue: Array.isArray(d.dailyRevenue) ? d.dailyRevenue : [],
      isLoading,
      error,
      isLoaded: Boolean(raw),
    }
  }
)

/**
 * Nexis Tech Store Dashboard Statistics Selector (Store-Isolated)
 * Pure composition of domain statistics from ordersSlice, cartsSlice, productsSlice, and usersSlice.
 */
export const selectStoreDashboardStats = createSelector(
  [selectStoreOrderStats, selectStoreCartStats, selectProductStats, selectUserStats],
  (orderStats, cartStats, productStats, userStats) => ({
    ...orderStats,
    ...cartStats,
    ...productStats,
    ...userStats,
    isLoading: Boolean(
      orderStats.isOrdersLoading ||
      cartStats.isCartsLoading ||
      productStats.isProductsLoading ||
      userStats.isUsersLoading
    ),
  })
)

/**
 * Convenience selector to get stats based on active scope ('store' | 'platform')
 * Fully memoized with createSelector to eliminate spurious re-renders.
 */
export const selectDashboardStats = createSelector(
  [selectDashboardScope, selectPlatformDashboardStats, selectStoreDashboardStats],
  (scope, platformStats, storeStats) => {
    return scope === 'platform' ? platformStats : storeStats
  }
)

export default dashboardSlice.reducer
