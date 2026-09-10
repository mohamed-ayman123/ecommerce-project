import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { getAllUsers, addUser, deleteUser } from '@/api/users'
import { changeUserRole } from '@/api/auth'

// Async Thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      const data = await getAllUsers(params)
      return data
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch users'
      )
    }
  }
)

export const createNewUser = createAsyncThunk(
  'users/createNewUser',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await addUser(userData)
      return data
    } catch (err) {
      const errorMsg =
        err.response?.data?.errors?.join(', ') ||
        err.response?.data?.message ||
        'Failed to add user'
      return rejectWithValue(errorMsg)
    }
  }
)

export const removeUser = createAsyncThunk(
  'users/removeUser',
  async (id, { rejectWithValue }) => {
    try {
      const data = await deleteUser(id)
      return { id, message: data?.message || 'User deleted successfully' }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete user'
      )
    }
  }
)

export const updateUserRole = createAsyncThunk(
  'users/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const data = await changeUserRole(userId, role)
      return { userId, role, data }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to update user role'
      )
    }
  }
)

const initialState = {
  items: [],
  total: 0,
  page: 1,
  totalPages: 1,
  isLoading: false,
  isActionLoading: false,
  error: null,
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false
        const payload = action.payload
        state.items = payload.users || (Array.isArray(payload) ? payload : [])
        state.total = payload.total ?? state.items.length
        state.page = payload.page ?? 1
        state.totalPages = payload.totalPages ?? 1
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // createNewUser
      .addCase(createNewUser.pending, (state) => {
        state.isActionLoading = true
      })
      .addCase(createNewUser.fulfilled, (state, action) => {
        state.isActionLoading = false
        const newUser = action.payload?.user || action.payload
        if (newUser && (newUser._id || newUser.id)) {
          state.items.unshift(newUser)
          state.total += 1
        }
      })
      .addCase(createNewUser.rejected, (state, action) => {
        state.isActionLoading = false
        state.error = action.payload
      })

      // removeUser
      .addCase(removeUser.pending, (state) => {
        state.isActionLoading = true
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.isActionLoading = false
        const deletedId = action.payload.id
        state.items = state.items.filter(
          (user) => (user._id || user.id) !== deletedId
        )
        state.total = Math.max(0, state.total - 1)
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.isActionLoading = false
        state.error = action.payload
      })

      // updateUserRole
      .addCase(updateUserRole.pending, (state) => {
        state.isActionLoading = true
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.isActionLoading = false
        const { userId, role, data } = action.payload
        const updatedUser = data?.user || data
        const idx = state.items.findIndex(
          (u) => (u._id || u.id) === userId
        )
        if (idx !== -1) {
          state.items[idx] = {
            ...state.items[idx],
            ...(typeof updatedUser === 'object' ? updatedUser : {}),
            role: role || state.items[idx].role,
          }
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.isActionLoading = false
        state.error = action.payload
      })
  },
})

export const { clearUserError } = usersSlice.actions

// ==========================================
// User Domain Selectors
// ==========================================

/**
 * User Directory & Customer Demographics Selector
 * Computes total users, customer count, and admin count.
 */
export const selectUserStats = createSelector(
  [
    (state) => state.users?.items || [],
    (state) => Boolean(state.users?.isLoading),
  ],
  (users, isLoading) => {
    const totalUsers = users.length
    const totalCustomers = users.filter((u) => u.role !== 'admin').length
    const totalAdmins = users.filter((u) => u.role === 'admin').length

    return {
      totalUsers,
      totalCustomers,
      totalAdmins,
      isUsersLoading: isLoading,
    }
  }
)

export default usersSlice.reducer