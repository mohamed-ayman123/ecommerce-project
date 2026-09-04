import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/api/products'

// Async Thunks - Service Layer via Redux
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const data = await getProducts(params)
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
      const errorMsg =
        err.response?.data?.errors?.join(', ') ||
        err.response?.data?.message ||
        'Failed to create product'
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
      const errorMsg =
        err.response?.data?.errors?.join(', ') ||
        err.response?.data?.message ||
        'Failed to update product'
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
        state.items = action.payload.products || []
        state.total = action.payload.total || action.payload.totalProducts || 0
        state.page = action.payload.currentPage || 1
        state.totalPages = action.payload.totalPages || 1
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
        state.selectedProduct = action.payload
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
        const created = action.payload.product || action.payload
        if (created) {
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
        const updated = action.payload.product || action.payload
        const idx = state.items.findIndex((p) => p._id === updated?._id)
        if (idx !== -1) {
          state.items[idx] = updated
        }
        if (state.selectedProduct?._id === updated?._id) {
          state.selectedProduct = updated
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
        state.items = state.items.filter((p) => p._id !== action.payload.id)
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

export default productsSlice.reducer
