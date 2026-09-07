import api from './axios'

export const getAdminOrders = async (params = {}) => {
  const response = await api.get('/orders/admin', { params })
  return response.data
}

export const getAdminOrderById = async (id) => {
  const response = await api.get(`/orders/admin/${id}`)
  return response.data
}

export const updateOrderStatus = async (id, statusData) => {
  const response = await api.patch(`/orders/admin/${id}/status`, statusData)
  return response.data
}

export const getDashboardStats = async () => {
  const response = await api.get('/orders/admin/dashboard')
  return response.data
}
