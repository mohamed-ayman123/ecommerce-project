import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isSidebarOpen: true,
  isMobileSidebarOpen: false,
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
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleMobileSidebar,
  closeMobileSidebar,
} = uiSlice.actions

export default uiSlice.reducer
