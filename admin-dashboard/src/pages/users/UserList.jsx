import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Users,
  UserPlus,
  Trash2,
  Shield,
  User as UserIcon,
  Loader2,
  AlertCircle,
  Mail,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react'
import { toast } from 'react-toastify'
import Modal from '@/components/common/Modal'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import Dropdown from '@/components/common/Dropdown'
import {
  fetchUsers,
  createNewUser,
  removeUser,
} from '@/store/slices/usersSlice'

export default function UserList() {
  const dispatch = useDispatch()
  const { items = [], total, isLoading, isActionLoading, error } = useSelector(
    (state) => state.users
  )

  const preferences = useSelector((state) => state.ui?.preferences)
  const pageSize = Number(preferences?.defaultPageSize) || 25
  const [currentPage, setCurrentPage] = useState(1)
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  // Filter users naturally by role and search query
  const filteredUsers = useMemo(() => {
    let result = items
    if (roleFilter !== 'ALL') {
      result = result.filter(
        (u) => (u.role || 'customer').toUpperCase() === roleFilter
      )
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim()
      result = result.filter((u) => {
        const name = `${u.firstName || ''} ${u.lastName || ''} ${u.name || ''} ${u.username || ''}`.toLowerCase()
        const email = (u.email || '').toLowerCase()
        return name.includes(q) || email.includes(q)
      })
    }
    return result
  }, [items, roleFilter, searchTerm])

  const totalUsers = filteredUsers.length
  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize))
  const safePage = Math.min(currentPage, totalPages)

  const startIndex = (safePage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalUsers)
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  const [userToDelete, setUserToDelete] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'USER',
  })
  const [formErrors, setFormErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const validate = () => {
    const errs = {}
    if (!formData.firstName.trim()) errs.firstName = 'First name is required'
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required'
    if (!formData.email.trim()) {
      errs.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address'
    }
    if (!formData.password) {
      errs.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters'
    }
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const payload = {
      username: `${formData.firstName} ${formData.lastName}`.trim() || formData.email.split('@')[0],
      email: formData.email,
      password: formData.password,
    }

    const resultAction = await dispatch(createNewUser(payload))
    if (createNewUser.fulfilled.match(resultAction)) {
      toast.success(
        resultAction.payload?.message || 'User registered successfully!'
      )
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'USER',
      })
      dispatch(fetchUsers())
    } else {
      toast.error(
        resultAction.payload || 'Failed to create user. Please check credentials.'
      )
    }
  }

  const handleDelete = (user) => {
    setUserToDelete(user)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return
    const userId = userToDelete._id || userToDelete.id

    const resultAction = await dispatch(removeUser(userId))
    if (removeUser.fulfilled.match(resultAction)) {
      toast.success(resultAction.payload?.message || 'User deleted successfully!')
    } else {
      toast.error(resultAction.payload || 'Failed to delete user.')
    }
    setUserToDelete(null)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[var(--color-dark-bg-card)] p-6 sm:p-8 rounded-3xl border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-dark)] text-white dark:bg-[var(--color-primary-medium)] flex items-center justify-center shrink-0 shadow-sm border border-[var(--color-primary-medium)]/30">
            <Users className="w-6 h-6 text-[var(--color-text-gold)]" />
          </div>
          <div className="space-y-1">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase font-heading bg-[var(--color-primary-medium)]/15 text-[var(--color-primary-dark)] border border-[var(--color-primary-medium)]/25 dark:bg-[var(--color-primary-medium)]/30 dark:text-[var(--color-text-gold)]">
              USER MANAGEMENT
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] tracking-tight">
              Users & Administrators
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] font-body">
              Manage accounts, control access privileges, and provision new team administrators.
            </p>
          </div>
        </div>

        {/* Metric Pill */}
        <div className="p-4 rounded-2xl bg-[var(--color-bg-main)]/70 dark:bg-[var(--color-dark-bg-main)]/60 border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 min-w-[200px] space-y-1">
          <span className="text-[10px] font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)] tracking-widest uppercase font-heading">
            REGISTERED ACCOUNTS
          </span>
          <p className="text-2xl font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)]">
            {total || items.length}{' '}
            <span className="text-xs font-normal font-body text-[var(--color-text-secondary)]">
              users
            </span>
          </p>
        </div>
      </div>

      {/* Add New User Card */}
      <div className="bg-white dark:bg-[var(--color-dark-bg-card)] rounded-2xl p-6 sm:p-8 shadow-xs border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30">
          <UserPlus className="w-5 h-5 text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)]" />
          <h2 className="text-base font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)]">
            Create Account
          </h2>
        </div>

        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="First Name"
              name="firstName"
              placeholder="e.g. John"
              value={formData.firstName}
              onChange={handleChange}
              error={formErrors.firstName}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              placeholder="e.g. Doe"
              value={formData.lastName}
              onChange={handleChange}
              error={formErrors.lastName}
              required
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              required
            />
          </div>

          <div className="flex items-center justify-end pt-2">
            <Button
              type="submit"
              isLoading={isActionLoading}
              variant="primary"
              className="w-full sm:w-auto"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </form>
      </div>

      {/* Users Table Card */}
      <div className="bg-white dark:bg-[var(--color-dark-bg-card)] rounded-2xl border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)]">
              Registered Users Directory
            </h3>
            <span className="text-xs text-[var(--color-text-secondary)] font-body">
              Showing {filteredUsers.length} of {items.length} accounts
            </span>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)] dark:text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search name or email..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-2xl border border-[var(--color-border-light)] dark:border-white/10 bg-[var(--color-bg-main)]/30 dark:bg-white/5 text-[var(--color-primary-dark)] dark:text-white placeholder:text-[var(--color-text-secondary)]/60 dark:placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-medium)]"
              />
            </div>

            <div className="w-full sm:w-44">
              <Dropdown
                value={roleFilter}
                onChange={(val) => {
                  setRoleFilter(val)
                  setCurrentPage(1)
                }}
                options={[
                  { value: 'ALL', label: 'All Roles' },
                  { value: 'ADMIN', label: 'Admins Only' },
                  { value: 'CUSTOMER', label: 'Customers Only' },
                ]}
                ariaLabel="Filter by Role"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)]" />
            <p className="text-sm text-[var(--color-text-secondary)] font-body">
              Loading user accounts...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-sm font-medium text-rose-600 font-body">{error}</p>
            <Button
              type="button"
              onClick={() => dispatch(fetchUsers())}
              variant="outline"
              size="sm"
            >
              Try Again
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-bg-input)]/50 dark:bg-[var(--color-dark-bg-main)] text-[var(--color-text-secondary)] flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)]">
              No users found
            </p>
            <p className="text-xs text-[var(--color-text-secondary)] font-body">
              Register your first user above to populate this catalog.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-bg-main)]/60 dark:bg-[var(--color-dark-bg-main)] text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] border-b border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30">
                <tr>
                  <th className="px-6 py-3.5 font-bold font-heading text-xs tracking-wider uppercase">
                    User
                  </th>
                  <th className="px-6 py-3.5 font-bold font-heading text-xs tracking-wider uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3.5 font-bold font-heading text-xs tracking-wider uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3.5 font-bold font-heading text-xs tracking-wider uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-medium)]/30 font-body">
                {paginatedUsers.map((user) => {
                  const userId = user._id || user.id
                  const displayName =
                    `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
                    user.name ||
                    user.username ||
                    'User'
                  const initials = (displayName[0] || 'U').toUpperCase()
                  const role = (user.role || 'USER').toUpperCase()
                  const isAdmin = role === 'ADMIN'

                  return (
                    <tr
                      key={userId}
                      className="hover:bg-[var(--color-bg-main)]/30 dark:hover:bg-[var(--color-dark-bg-main)]/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-medium)]/15 dark:bg-[var(--color-primary-medium)]/30 text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)] border border-[var(--color-primary-medium)]/25 flex items-center justify-center font-bold text-xs font-heading shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] font-heading">
                              {displayName}
                            </p>
                            <p className="text-xs text-[var(--color-text-secondary)] font-body">
                              ID: {userId?.slice?.(-6) || userId}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)] dark:text-[var(--color-border-medium)] text-xs font-body">
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span>{user.email}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-heading ${
                            isAdmin
                              ? 'bg-[var(--color-primary-dark)] text-white dark:bg-[var(--color-primary-medium)]'
                              : 'bg-[var(--color-bg-input)]/70 text-[var(--color-primary-dark)] dark:bg-[var(--color-dark-bg-main)] dark:text-[var(--color-text-gold)] border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/40'
                          }`}
                        >
                          {isAdmin ? (
                            <Shield className="w-3 h-3 text-[var(--color-text-gold)]" />
                          ) : (
                            <UserIcon className="w-3 h-3 text-[var(--color-text-secondary)]" />
                          )}
                          <span>{role}</span>
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user)}
                          disabled={isActionLoading}
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          title="Delete user account"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!isLoading && !error && totalUsers > 0 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border-light)] dark:border-[var(--color-primary-medium)]/30 px-6 py-4 sm:flex-row bg-[var(--color-bg-card)] dark:bg-[var(--color-dark-bg-card)]">
            <p className="text-xs text-[var(--color-text-secondary)] dark:text-slate-300">
              Showing{' '}
              <span className="font-semibold text-[var(--color-text-primary)] dark:text-white">
                {startIndex + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-[var(--color-text-primary)] dark:text-white">
                {endIndex}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-[var(--color-text-primary)] dark:text-white">
                {totalUsers}
              </span>{' '}
              users
            </p>

            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(safePage - 1)}
                  disabled={safePage === 1}
                  aria-label="Previous page"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-main)] dark:bg-[var(--color-dark-bg-card)] dark:border-[var(--color-primary-medium)]/40 dark:text-slate-300 dark:hover:bg-[var(--color-primary-medium)]/30 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => goToPage(page)}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold cursor-pointer transition-colors ${
                        page === safePage
                          ? 'bg-[var(--color-primary-dark)] text-white dark:bg-[var(--color-text-gold)] dark:text-[var(--color-primary-dark)] shadow-sm'
                          : 'border border-[var(--color-border-light)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-main)] dark:bg-[var(--color-dark-bg-card)] dark:border-[var(--color-primary-medium)]/40 dark:text-slate-300 dark:hover:bg-[var(--color-primary-medium)]/30'
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage === totalPages}
                  aria-label="Next page"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-main)] dark:bg-[var(--color-dark-bg-card)] dark:border-[var(--color-primary-medium)]/40 dark:text-slate-300 dark:hover:bg-[var(--color-primary-medium)]/30 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete User Confirmation Modal */}
      <Modal
        isOpen={Boolean(userToDelete)}
        onClose={() => !isActionLoading && setUserToDelete(null)}
        title="Confirm Account Deletion"
        maxWidth="max-w-md"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setUserToDelete(null)}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={confirmDelete}
              isLoading={isActionLoading}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Delete User
            </Button>
          </>
        }
      >
        <div className="space-y-2">
          <p className="text-sm text-[var(--color-text-primary)] dark:text-[var(--color-text-light)]">
            Are you sure you want to delete the account for{' '}
            <strong className="font-bold text-[var(--color-primary-dark)] dark:text-[var(--color-text-gold)]">
              {`${userToDelete?.firstName || ''} ${userToDelete?.lastName || ''}`.trim() ||
                userToDelete?.name ||
                userToDelete?.email}
            </strong>
            ?
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] font-body leading-relaxed">
            This action will permanently revoke access and remove the user profile from the database. This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  )
}