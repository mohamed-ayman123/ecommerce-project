import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/api/products'
import { isElectronicsOrHardwareProduct } from '@/constants/categories'

// Async Thunks - Service Layer via Redux
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await getProducts({ limit: 100, ...params })
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch products'
      )
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await getProductById(id)
      return data.product || data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch product details'
      )
    }
  }
)

export const addNewProduct = createAsyncThunk(
  'products/addNewProduct',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await createProduct(formData)
      return data
    } catch (err) {
      const data = err.response?.data
      let errorMsg = 'Failed to create product'
      if (Array.isArray(data?.errors) && data.errors.length > 0) {
        errorMsg = data.errors.join(', ')
      } else if (data?.message) {
        if (data.message.includes('E11000') && data.message.includes('sku')) {
          errorMsg = 'A product with this SKU already exists. Please enter a unique SKU.'
        } else if (data.message.includes('E11000') && data.message.includes('name')) {
          errorMsg = 'A product with this name already exists. Please choose a unique name.'
        } else {
          errorMsg = data.message
        }
      } else if (data?.error) {
        errorMsg = data.error
      } else if (err.message) {
        errorMsg = err.message
      }
      return rejectWithValue(errorMsg)
    }
  }
)

export const updateExistingProduct = createAsyncThunk(
  'products/updateExistingProduct',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const data = await updateProduct(id, formData)
      return data
    } catch (err) {
      const data = err.response?.data
      let errorMsg = 'Failed to update product'
      if (Array.isArray(data?.errors) && data.errors.length > 0) {
        errorMsg = data.errors.join(', ')
      } else if (data?.message) {
        if (data.message.includes('E11000') && data.message.includes('sku')) {
          errorMsg = 'A product with this SKU already exists. Please enter a unique SKU.'
        } else {
          errorMsg = data.message
        }
      } else if (data?.error) {
        errorMsg = data.error
      } else if (err.message) {
        errorMsg = err.message
      }
      return rejectWithValue(errorMsg)
    }
  }
)

export const deleteProductById = createAsyncThunk(
  'products/deleteProductById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteProduct(id)
      return { id, message: data.message }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete product'
      )
    }
  }
)

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
    clearProductsError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        const payload = action.payload || {}
        const rawItems =
          payload.products ||
          payload.data ||
          (Array.isArray(payload) ? payload : [])

        // Strict category filter: Electronics & Hardware products ONLY
        state.items = rawItems.filter(isElectronicsOrHardwareProduct)
        state.total = state.items.length
        state.page = payload.currentPage || payload.page || 1
        state.totalPages = payload.totalPages || 1
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Fetch Single Product
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedProduct = action.payload?.product || action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Add New Product
      .addCase(addNewProduct.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.isLoading = false
        const created = action.payload?.product || action.payload
        if (
          created &&
          (created._id || created.id) &&
          isElectronicsOrHardwareProduct(created)
        ) {
          state.items.unshift(created)
          state.total += 1
        }
      })
      .addCase(addNewProduct.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Update Product
      .addCase(updateExistingProduct.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateExistingProduct.fulfilled, (state, action) => {
        state.isLoading = false
        const updated = action.payload?.product || action.payload
        if (updated) {
          const updatedId = updated._id || updated.id
          const idx = state.items.findIndex(
            (p) => (p._id || p.id) === updatedId
          )
          if (idx !== -1) {
            state.items[idx] = updated
          }
          if (
            state.selectedProduct &&
            (state.selectedProduct._id || state.selectedProduct.id) === updatedId
          ) {
            state.selectedProduct = updated
          }
        }
      })
      .addCase(updateExistingProduct.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Delete Product
      .addCase(deleteProductById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteProductById.fulfilled, (state, action) => {
        state.isLoading = false
        const deletedId = action.payload.id
        state.items = state.items.filter(
          (p) => (p._id || p.id) !== deletedId
        )
        state.total = Math.max(0, state.total - 1)
      })
      .addCase(deleteProductById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const {
  setSelectedProduct,
  setProductFilter,
  clearProductFilters,
  clearProductsError,
} = productsSlice.actions

// ==========================================
// Product Domain Selectors
// ==========================================

/**
 * Product Catalog & Inventory Statistics Selector
 * Computes catalog totals, in-stock count, and out-of-stock count.
 */
export const selectProductStats = createSelector(
  [
    (state) => state.products?.items || [],
    (state) => Boolean(state.products?.isLoading),
  ],
  (products, isLoading) => {
    const totalProducts = products.length
    const inStockProducts = products.filter(
      (p) => (Number(p.stock) || Number(p.quantity) || 0) > 0
    ).length
    const outOfStockProducts = products.filter(
      (p) => (Number(p.stock) || Number(p.quantity) || 0) <= 0
    ).length

    return {
      totalProducts,
      inStockProducts,
      outOfStockProducts,
      isProductsLoading: isLoading,
    }
  }
)

export default productsSlice.reducer
