import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { fetchAdminOrders, selectStoreOrderStats } from './ordersSlice'
import { fetchAdminCarts, selectStoreCartStats } from './cartsSlice'
import { fetchProducts, selectProductStats } from './productsSlice'
import { fetchUsers, selectUserStats } from './usersSlice'

/**
 * ============================================================================
 * Async Thunk: Fetch All Dashboard Data (Unified Domain Orchestrator)
 * ============================================================================
 * Dispatches domain collections in parallel so dashboard components only need 1 action.
 * Cache-first: checks getState() to prevent redundant network requests.
 */
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (args = {}, { dispatch, getState }) => {
    const force = Boolean(args?.force)
    const state = getState()
    const promises = []

    // 1. Orders collection
    if (force || !state.orders?.items?.length) {
      promises.push(dispatch(fetchAdminOrders({ limit: 100 })))
    }

    // 2. Products collection
    if (force || !state.products?.items?.length) {
      promises.push(dispatch(fetchProducts({ limit: 100 })))
    }

    // 3. Active carts collection
    if (force || !state.carts?.items?.length) {
      promises.push(dispatch(fetchAdminCarts()))
    }

    // 4. Users collection
    if (force || !state.users?.items?.length) {
      promises.push(dispatch(fetchUsers()))
    }

    if (promises.length > 0) {
      await Promise.allSettled(promises)
    }
  }
)

const initialState = {
  isLoading: false,
  error: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
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

export const { clearDashboardError } = dashboardSlice.actions

// ============================================================================
// Dashboard Selectors (Store-Isolated Domain Model)
// ============================================================================

/**
 * Nexis Tech Store Dashboard Statistics Selector
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
 * Main dashboard stats selector directly pointing to Nexis Tech store metrics.
 */
export const selectDashboardStats = selectStoreDashboardStats

export default dashboardSlice.reducer
