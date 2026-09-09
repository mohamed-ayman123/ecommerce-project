import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getAdminActiveCarts } from '@/api/carts'

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

export default cartsSlice.reducer
