import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  category: '',
  subcategory: '',
  brand: '',
  searchQuery: '',
  minPrice: '',
  maxPrice: '',
  sortBy: 'newest',
  page: 1,
}

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload
      state.subcategory = ''
      state.page = 1
    },
    setSubcategory: (state, action) => {
      state.subcategory = action.payload
      state.page = 1
    },
    setBrand: (state, action) => {
      state.brand = action.payload
      state.page = 1
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
      state.page = 1
    },
    setPriceRange: (state, action) => {
      state.minPrice = action.payload.min
      state.maxPrice = action.payload.max
      state.page = 1
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload
    },
    setPage: (state, action) => {
      state.page = action.payload
    },
    resetFilters: (state) => {
      state.category = ''
      state.subcategory = ''
      state.brand = ''
      state.searchQuery = ''
      state.minPrice = ''
      state.maxPrice = ''
      state.sortBy = 'newest'
      state.page = 1
    },
  },
})

export const {
  setCategory,
  setSubcategory,
  setBrand,
  setSearchQuery,
  setPriceRange,
  setSortBy,
  setPage,
  resetFilters,
} = filterSlice.actions

export default filterSlice.reducer
