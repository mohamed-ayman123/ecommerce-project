import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '../Components/Layout/AppLayout'
import AuthLayout from '../Components/Layout/AuthLayout'

function AppRoutes() {
  return (
    <Routes>
      {/* Auth routes (clean layout for login/auth) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<h2>Login</h2>} />
      </Route>

      {/* Dashboard routes (wrapped with Sidebar + Navbar) */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<h2>dashboard</h2>} />
        <Route path="/dashboard/products" element={<h2>Products</h2>} />
        <Route path="/dashboard/users" element={<h2>users</h2>} />
        <Route path="/dashboard/products/new" element={<h2>add products</h2>} />
        <Route path="/dashboard/orders" element={<h2>orders</h2>} />
        <Route path="/dashboard/carts" element={<h2>carts</h2>} />
        <Route path="/dashboard/settings" element={<h2>settings</h2>} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;