import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    items:[],
    total: 0,
    page: 1,
    totalPages: 1,
    isLoading: false,
    error: null,
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsersLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setUsers: (state, action) => {
            state.items = action.payload.users || []
            state.total = action.payload.total || 0
            state.isLoading = false
            state.error = null
        },
        setUsersError: (state, action) => {
            state.error = action.payload
            state.isLoading = false
        },
    },
})

export const {
    setUsersLoading,
    setUsers,
    setUsersError,
} = userSlice.actions

export default userSlice.reducer