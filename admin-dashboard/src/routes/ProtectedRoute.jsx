import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

export default function ProtectedRoute() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warn('Please sign in to access the admin dashboard.', {
        toastId: 'auth-required-toast',
      })
    } else if (user?.role && user.role !== 'admin') {
      toast.error('Access denied. Administrator privileges are required.', {
        toastId: 'admin-required-toast',
      })
    }
  }, [isAuthenticated, user])

  // Verify token exists and role is admin
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If user role is present and not admin, redirect
  if (user?.role && user.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
