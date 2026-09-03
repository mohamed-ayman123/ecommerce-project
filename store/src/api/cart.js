import api from './axios'

export const getCart = async () => {
  const response = await api.get('/carts')
  return response.data
}

export const addToCartApi = async (itemData) => {
  const response = await api.post('/carts/items', itemData)
  return response.data
}

export const updateCartItemApi = async (itemData) => {
  const response = await api.patch('/carts/items', itemData)
  return response.data
}

export const removeCartItemApi = async (productId) => {
  const response = await api.delete(`/carts/items/${productId}`)
  return response.data
}

export const applyCouponApi = async (couponCode) => {
  const response = await api.post('/carts/coupon', { code: couponCode })
  return response.data
}

export const clearCartApi = async () => {
  const response = await api.delete('/carts/clear')
  return response.data
}
