import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function GuestRoute() {
  const { isAuthenticated } = useSelector((state) => state.auth)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
