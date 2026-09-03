import api from './axios'

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData)
  return response.data
}

export const getMyOrders = async (params = {}) => {
  const response = await api.get('/orders/my', { params })
  return response.data
}

export const getMyOrderById = async (id) => {
  const response = await api.get(`/orders/my/${id}`)
  return response.data
}

export const cancelOrder = async (id) => {
  const response = await api.patch(`/orders/my/${id}/cancel`)
  return response.data
}
