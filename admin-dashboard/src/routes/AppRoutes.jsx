import { Routes, Route, Navigate } from 'react-router-dom'
import AddProduct from '@/pages/products/AddProduct'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/dashboard/products/new" element={<AddProduct />} />
    </Routes>
  )
}
