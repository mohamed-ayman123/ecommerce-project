import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  total: 0,
  page: 1,
  totalPages: 1,
  selectedProduct: null,
  filters: {
    category: '',
    brand: '',
    search: '',
  },
  isLoading: false,
  error: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProductsLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setProducts: (state, action) => {
      state.items = action.payload.products || []
      state.total = action.payload.total || action.payload.totalProducts || 0
      state.page = action.payload.currentPage || 1
      state.totalPages = action.payload.totalPages || 1
      state.isLoading = false
      state.error = null
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload
    },
    setProductFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
      state.page = 1
    },
    clearProductFilters: (state) => {
      state.filters = { category: '', brand: '', search: '' }
      state.page = 1
    },
    setProductsError: (state, action) => {
      state.error = action.payload
      state.isLoading = false
    },
  },
})

export const {
  setProductsLoading,
  setProducts,
  setSelectedProduct,
  setProductFilter,
  clearProductFilters,
  setProductsError,
} = productsSlice.actions

export default productsSlice.reducer
