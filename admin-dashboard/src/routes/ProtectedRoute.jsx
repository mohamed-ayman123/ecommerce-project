import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { logout } from '@/store/slices/authSlice'

export default function ProtectedRoute() {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const location = useLocation()

  const userRole = (user?.role || '').toLowerCase()
  const isAdmin = userRole === 'admin'
  const isNonAdmin = Boolean(isAuthenticated && !isAdmin)

  useEffect(() => {
    if (isNonAdmin) {
      toast.error('Access denied. Administrator privileges are required.', {
        toastId: 'admin-required-toast',
      })
      // Clear non-admin auth so user isn't stuck in an infinite redirect ping-pong loop with /login
      dispatch(logout())
    }
  }, [isNonAdmin, dispatch])

  // Verify token exists and role is admin
  if (!isAuthenticated || isNonAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
