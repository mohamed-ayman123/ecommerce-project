import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  discount: 0,
  total: 0,
  couponCode: null,
  isLoading: false,
}

const calculateTotals = (items, discount = 0) => {
  const subtotal = items.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0)
  const count = items.reduce((acc, item) => acc + (item.quantity || 1), 0)
  const total = Math.max(0, subtotal - discount)
  return { subtotal, itemCount: count, total }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload.items || []
      state.itemCount = action.payload.itemCount || 0
      state.subtotal = action.payload.subtotal || 0
      state.discount = action.payload.discount || 0
      state.total = action.payload.total || state.subtotal
      state.couponCode = action.payload.couponCode || null
    },
    addToCart: (state, action) => {
      const item = action.payload
      const existing = state.items.find((i) => i.productId === item.productId || i._id === item._id)
      if (existing) {
        existing.quantity += item.quantity || 1
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 })
      }
      const { subtotal, itemCount, total } = calculateTotals(state.items, state.discount)
      state.subtotal = subtotal
      state.itemCount = itemCount
      state.total = total
    },
    removeFromCart: (state, action) => {
      const productId = action.payload
      state.items = state.items.filter((i) => i.productId !== productId && i._id !== productId)
      const { subtotal, itemCount, total } = calculateTotals(state.items, state.discount)
      state.subtotal = subtotal
      state.itemCount = itemCount
      state.total = total
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload
      const item = state.items.find((i) => i.productId === productId || i._id === productId)
      if (item) {
        item.quantity = Math.max(1, quantity)
      }
      const { subtotal, itemCount, total } = calculateTotals(state.items, state.discount)
      state.subtotal = subtotal
      state.itemCount = itemCount
      state.total = total
    },
    applyCoupon: (state, action) => {
      state.couponCode = action.payload.code
      state.discount = action.payload.discountAmount || 0
      state.total = Math.max(0, state.subtotal - state.discount)
    },
    clearCart: (state) => {
      state.items = []
      state.itemCount = 0
      state.subtotal = 0
      state.discount = 0
      state.total = 0
      state.couponCode = null
    },
    setCartLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const {
  setCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  applyCoupon,
  clearCart,
  setCartLoading,
} = cartSlice.actions

export default cartSlice.reducer
