import { useEffect, useState } from 'react'
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
} from 'lucide-react'
import { toast } from 'react-toastify'
import Modal from '@/components/common/Modal'
import {
  fetchUsers,
  createNewUser,
  removeUser,
} from '@/store/slices/usersSlice'

export default function UserList() {
  const dispatch = useDispatch()
  const { items, total, isLoading, isActionLoading, error } = useSelector(
    (state) => state.users
  )

  const [userToDelete, setUserToDelete] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'USER',
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

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
            {/* First Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] uppercase tracking-wider">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="e.g. John"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 bg-[var(--color-bg-input)]/45 dark:bg-[var(--color-dark-bg-main)] border rounded-xl text-sm text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] placeholder-[var(--color-text-secondary)]/70 font-body transition-all duration-150 focus:bg-white dark:focus:bg-[var(--color-dark-bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-medium)] dark:focus:ring-[var(--color-text-gold)] ${
                  formErrors.firstName
                    ? 'border-rose-400 bg-rose-50/40'
                    : 'border-[var(--color-border-medium)] hover:border-[var(--color-primary-medium)] dark:border-[var(--color-primary-medium)]/40 shadow-2xs'
                }`}
              />
              {formErrors.firstName && (
                <p className="text-[11px] text-rose-500 font-medium font-body">
                  {formErrors.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] uppercase tracking-wider">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="e.g. Doe"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 bg-[var(--color-bg-input)]/45 dark:bg-[var(--color-dark-bg-main)] border rounded-xl text-sm text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] placeholder-[var(--color-text-secondary)]/70 font-body transition-all duration-150 focus:bg-white dark:focus:bg-[var(--color-dark-bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-medium)] dark:focus:ring-[var(--color-text-gold)] ${
                  formErrors.lastName
                    ? 'border-rose-400 bg-rose-50/40'
                    : 'border-[var(--color-border-medium)] hover:border-[var(--color-primary-medium)] dark:border-[var(--color-primary-medium)]/40 shadow-2xs'
                }`}
              />
              {formErrors.lastName && (
                <p className="text-[11px] text-rose-500 font-medium font-body">
                  {formErrors.lastName}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] uppercase tracking-wider">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="john.doe@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 bg-[var(--color-bg-input)]/45 dark:bg-[var(--color-dark-bg-main)] border rounded-xl text-sm text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] placeholder-[var(--color-text-secondary)]/70 font-body transition-all duration-150 focus:bg-white dark:focus:bg-[var(--color-dark-bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-medium)] dark:focus:ring-[var(--color-text-gold)] ${
                  formErrors.email
                    ? 'border-rose-400 bg-rose-50/40'
                    : 'border-[var(--color-border-medium)] hover:border-[var(--color-primary-medium)] dark:border-[var(--color-primary-medium)]/40 shadow-2xs'
                }`}
              />
              {formErrors.email && (
                <p className="text-[11px] text-rose-500 font-medium font-body">
                  {formErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] uppercase tracking-wider">
                Password <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3.5 py-2.5 bg-[var(--color-bg-input)]/45 dark:bg-[var(--color-dark-bg-main)] border rounded-xl text-sm text-[var(--color-text-primary)] dark:text-[var(--color-text-light)] placeholder-[var(--color-text-secondary)]/70 font-body transition-all duration-150 focus:bg-white dark:focus:bg-[var(--color-dark-bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-medium)] dark:focus:ring-[var(--color-text-gold)] ${
                  formErrors.password
                    ? 'border-rose-400 bg-rose-50/40'
                    : 'border-[var(--color-border-medium)] hover:border-[var(--color-primary-medium)] dark:border-[var(--color-primary-medium)]/40 shadow-2xs'
                }`}
              />
              {formErrors.password && (
                <p className="text-[11px] text-rose-500 font-medium font-body">
                  {formErrors.password}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={isActionLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-heading font-bold text-sm bg-[var(--color-primary-dark)] hover:bg-[var(--color-primary-medium)] dark:bg-[var(--color-primary-medium)] dark:hover:bg-[var(--color-accent-gold-hover)] text-white shadow-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isActionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Add User</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Users Table Card */}
      <div className="bg-white dark:bg-[var(--color-dark-bg-card)] rounded-2xl border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/30 flex items-center justify-between">
          <h3 className="text-sm font-bold font-heading text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)]">
            Registered Users Directory
          </h3>
          <span className="text-xs text-[var(--color-text-secondary)] font-body">
            Showing {items.length} accounts
          </span>
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
            <button
              type="button"
              onClick={() => dispatch(fetchUsers())}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-[var(--color-border-medium)] text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] hover:bg-[var(--color-bg-main)] transition-colors cursor-pointer"
            >
              Try Again
            </button>
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
              <tbody className="divide-y divide-[var(--color-border-medium)]/50 dark:divide-[var(--color-primary-medium)]/30">
                {items.map((user) => {
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
                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          disabled={isActionLoading}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete user account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
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
            <button
              type="button"
              onClick={() => setUserToDelete(null)}
              disabled={isActionLoading}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-[var(--color-border-medium)] dark:border-[var(--color-primary-medium)]/40 text-[var(--color-primary-dark)] dark:text-[var(--color-text-light)] hover:bg-[var(--color-bg-main)]/60 dark:hover:bg-[var(--color-dark-bg-main)] transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={isActionLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {isActionLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete User</span>
                </>
              )}
            </button>
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