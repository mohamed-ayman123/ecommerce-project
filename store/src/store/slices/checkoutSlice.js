import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'nexis_last_shipping_address'

// Egyptian phone validation regex (010, 011, 012, 015 with optional +20 or 20 prefix)
export const EGYPT_PHONE_REGEX = /^(\+?20|0)?1[0125][0-9]{8}$/

export const validateEgyptianPhone = (phone) => {
  if (!phone) return false
  const cleanPhone = String(phone).replace(/[\s-]/g, '')
  return EGYPT_PHONE_REGEX.test(cleanPhone)
}

const getInitialAddress = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        fullName: parsed.fullName || '',
        phone: parsed.phone || '',
        country: 'Egypt',
        city: parsed.city || '',
        address: parsed.address || '',
        postalCode: parsed.postalCode || '',
        customerNote: parsed.customerNote || '',
      }
    }
  } catch {
    // Ignore storage parse errors
  }
  return {
    fullName: '',
    phone: '',
    country: 'Egypt',
    city: '',
    address: '',
    postalCode: '',
    customerNote: '',
  }
}

const checkAddressValidity = (addr) => {
  if (!addr) return false
  const hasName = Boolean(addr.fullName && addr.fullName.trim().length >= 2)
  const hasPhone = validateEgyptianPhone(addr.phone)
  const hasCity = Boolean(addr.city && addr.city.trim().length >= 2)
  const hasAddress = Boolean(addr.address && addr.address.trim().length >= 5)
  return hasName && hasPhone && hasCity && hasAddress
}

const initialAddress = getInitialAddress()

const initialState = {
  shippingAddress: initialAddress,
  paymentMethod: 'cash', // 'cash' | 'stripe'
  isAddressValid: checkAddressValidity(initialAddress),
}

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    updateShippingField: (state, action) => {
      const { field, value } = action.payload
      state.shippingAddress[field] = value
      state.isAddressValid = checkAddressValidity(state.shippingAddress)

      // Sync address fields to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.shippingAddress))
      } catch {
        // Ignore storage write issues
      }
    },
    setShippingAddress: (state, action) => {
      const newAddress = {
        ...state.shippingAddress,
        ...action.payload,
        country: 'Egypt',
      }
      state.shippingAddress = newAddress
      state.isAddressValid = checkAddressValidity(newAddress)

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newAddress))
      } catch {
        // Ignore storage write issues
      }
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload
    },
    setCustomerNote: (state, action) => {
      state.shippingAddress.customerNote = action.payload
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.shippingAddress))
      } catch {
        // Ignore storage write issues
      }
    },
    resetCheckoutDraft: (state) => {
      state.paymentMethod = 'cash'
      // Keep shippingAddress for customer convenience on future checkouts, but reset note
      state.shippingAddress.customerNote = ''
    },
  },
})

export const {
  updateShippingField,
  setShippingAddress,
  setPaymentMethod,
  setCustomerNote,
  resetCheckoutDraft,
} = checkoutSlice.actions

export const selectShippingAddress = (state) => state.checkout.shippingAddress
export const selectPaymentMethod = (state) => state.checkout.paymentMethod
export const selectIsAddressValid = (state) => state.checkout.isAddressValid
export const selectCustomerNote = (state) => state.checkout.shippingAddress.customerNote

export default checkoutSlice.reducer
