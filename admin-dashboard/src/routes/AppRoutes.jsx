import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import AddProduct from "@/pages/products/AddProduct";
import EditProduct from "@/pages/products/EditProduct";
import SettingsPage from "@/pages/settings/SettingsPage";

export default function AppRoutes() {
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
        <Route path="/dashboard/products/new" element={<AddProduct />} />
        <Route path="/dashboard/products/:id/edit" element={<EditProduct />} />
        <Route path="/dashboard/users" element={<h2>users</h2>} />
        <Route path="/dashboard/orders" element={<h2>orders</h2>} />
        <Route path="/dashboard/carts" element={<h2>carts</h2>} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
