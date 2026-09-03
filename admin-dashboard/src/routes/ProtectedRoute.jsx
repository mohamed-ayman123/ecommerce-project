import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  // Verify token exists and role is admin (or fallback to authenticated in dev/mock)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // If user role is present and not admin, redirect
  if (user?.role && user.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
