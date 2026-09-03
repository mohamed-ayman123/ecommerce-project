import api from './axios'

export const getAdminActiveCarts = async (params = {}) => {
  const response = await api.get('/orders/admin/carts', { params })
  return response.data
}
