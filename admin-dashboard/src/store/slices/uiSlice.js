import { createSlice } from '@reduxjs/toolkit'

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

const DEFAULT_PREFERENCES = {
  defaultLanding: '/dashboard',
  defaultPageSize: 25,
  currency: 'EGP',
  toastPosition: 'top-right',
  toastDuration: 3000,
}

const getStoredPreferences = () => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('admin_preferences')
      if (stored) return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) }
    } catch {
      // Fallback on corrupt JSON
    }
  }
  return DEFAULT_PREFERENCES
}

const initialState = {
  isSidebarOpen: true,
  isMobileSidebarOpen: false,
  theme: getInitialTheme(),
  preferences: getStoredPreferences(),
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload
    },
    toggleMobileSidebar: (state) => {
      state.isMobileSidebarOpen = !state.isMobileSidebarOpen
    },
    closeMobileSidebar: (state) => {
      state.isMobileSidebarOpen = false
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', state.theme)
    },
    setTheme: (state, action) => {
      state.theme = action.payload
      localStorage.setItem('theme', state.theme)
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload }
      localStorage.setItem(
        'admin_preferences',
        JSON.stringify(state.preferences)
      )
    },
    resetPreferences: (state) => {
      state.preferences = DEFAULT_PREFERENCES
      state.theme = 'light'
      localStorage.setItem('theme', 'light')
      localStorage.removeItem('admin_preferences')
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleMobileSidebar,
  closeMobileSidebar,
  toggleTheme,
  setTheme,
  updatePreferences,
  resetPreferences,
} = uiSlice.actions

export default uiSlice.reducer
