import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  totalProducts: 0,
  isLoading: false,
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload.products || action.payload || []
      state.totalProducts = state.items.length
    },
    addToWishlist: (state, action) => {
      const product = action.payload
      const exists = state.items.some((i) => (i._id || i.productId) === (product._id || product.productId))
      if (!exists) {
        state.items.push(product)
        state.totalProducts = state.items.length
      }
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload
      state.items = state.items.filter((i) => (i._id || i.productId) !== productId)
      state.totalProducts = state.items.length
    },
    clearWishlist: (state) => {
      state.items = []
      state.totalProducts = 0
    },
    setWishlistLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  setWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlistLoading,
} = wishlistSlice.actions

export default wishlistSlice.reducer
