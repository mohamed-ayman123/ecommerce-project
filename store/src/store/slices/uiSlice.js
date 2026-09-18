import { createSlice } from '@reduxjs/toolkit'

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme')
    if (saved) return saved
    return 'light'
  }
  return 'light'
}

const initialState = {
  theme: getInitialTheme(),
  isCartDrawerOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', state.theme)
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload
      localStorage.setItem('theme', state.theme)
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    openCartDrawer: (state) => {
      state.isCartDrawerOpen = true
    },
    closeCartDrawer: (state) => {
      state.isCartDrawerOpen = false
    },
    toggleCartDrawer: (state) => {
      state.isCartDrawerOpen = !state.isCartDrawerOpen
    },
    openMobileMenu: (state) => {
      state.isMobileMenuOpen = true
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen
    },
    openSearch: (state) => {
      state.isSearchOpen = true
    },
    closeSearch: (state) => {
      state.isSearchOpen = false
    },
    toggleSearch: (state) => {
      state.isSearchOpen = !state.isSearchOpen
    },
  },
})

export const {
  toggleTheme,
  setTheme,
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
  openMobileMenu,
  closeMobileMenu,
  toggleMobileMenu,
  openSearch,
  closeSearch,
  toggleSearch,
} = uiSlice.actions

export const selectTheme = (state) => state.ui.theme
export const selectIsCartDrawerOpen = (state) => state.ui.isCartDrawerOpen
export const selectIsMobileMenuOpen = (state) => state.ui.isMobileMenuOpen
export const selectIsSearchOpen = (state) => state.ui.isSearchOpen

export default uiSlice.reducer
