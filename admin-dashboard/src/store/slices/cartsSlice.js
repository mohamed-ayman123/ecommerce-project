import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { getAdminActiveCarts } from '@/api/carts'
import {
  buildStoreCatalogLookup,
  isStoreCart,
  filterStoreCart,
} from '@/utils/storeCatalog'

// Async Thunks
export const fetchAdminCarts = createAsyncThunk(
  'carts/fetchAdminCarts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await getAdminActiveCarts(params)
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch active carts'
      )
    }
  }
)

const initialState = {
  items: [],
  total: 0,
  page: 1,
  totalPages: 1,
  limit: 25,
  isLoading: false,
  error: null,
  searchTerm: '',
  sortBy: 'newest',
  storeOnly: true,
  selectedCart: null,
}

const cartsSlice = createSlice({
  name: 'carts',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
      state.page = 1
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload
    },
    setPage: (state, action) => {
      state.page = action.payload
    },
    setStoreOnly: (state, action) => {
      state.storeOnly = action.payload
      state.page = 1
    },
    setSelectedCart: (state, action) => {
      state.selectedCart = action.payload
    },
    clearCartError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAdminCarts
      .addCase(fetchAdminCarts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAdminCarts.fulfilled, (state, action) => {
        state.isLoading = false
        const payload = action.payload || {}
        state.items = payload.carts || (Array.isArray(payload) ? payload : [])
        state.total = payload.total ?? state.items.length
        state.page = payload.currentPage ?? state.page ?? 1
        state.totalPages = payload.totalPages ?? 1
      })
      .addCase(fetchAdminCarts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const {
  setSearchTerm,
  setSortBy,
  setPage,
  setStoreOnly,
  setSelectedCart,
  clearCartError,
} = cartsSlice.actions

// ==========================================
// Cart Domain Selectors
// ==========================================

/**
 * Nexis Tech Store Cart Statistics Selector
 * Computes active carts, pipeline revenue, and item metrics for store-isolated sessions.
 */
export const selectStoreCartStats = createSelector(
  [
    (state) => state.carts?.items || [],
    (state) => state.products?.items || [],
    (state) => Boolean(state.carts?.isLoading),
  ],
  (carts, products, isLoading) => {
    const lookup = buildStoreCatalogLookup(products)

    const storeCarts = carts
      .filter((cart) => isStoreCart(cart, lookup))
      .map((cart) => filterStoreCart(cart, lookup))

    const activeCarts = storeCarts.length
    const pipelineRevenue = storeCarts.reduce(
      (sum, cart) => sum + (Number(cart.subtotal) || 0),
      0
    )
    const totalItemsCount = storeCarts.reduce(
      (sum, cart) => sum + (Number(cart.itemCount) || cart.items?.length || 0),
      0
    )
    const avgValue =
      activeCarts > 0 ? (pipelineRevenue / activeCarts).toFixed(2) : '0.00'

    return {
      activeCarts,
      totalActive: activeCarts,
      pipelineRevenue: Number(pipelineRevenue.toFixed(2)),
      totalPipelineValue: Number(pipelineRevenue.toFixed(2)),
      totalItemsCount,
      avgValue,
      isCartsLoading: isLoading,
    }
  }
)

export default cartsSlice.reducer
