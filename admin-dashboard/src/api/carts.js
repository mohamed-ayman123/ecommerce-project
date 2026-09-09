import api from './axios'

/**
 * Fetch all active customer carts for admin overview.
 * Backend route: GET /orders/admin/carts
 * Supports query params: { page, limit }
 */
export const getAdminActiveCarts = async (params = {}) => {
  const response = await api.get('/orders/admin/carts', { params })
  return response.data
}

export default {
  getAdminActiveCarts,
}
