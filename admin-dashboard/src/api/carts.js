import api from './axios'

export const getAdminActiveCarts = async (params = {}) => {
  const response = await api.get('/carts', { params })
  return response.data
}

// تحديث عنصر داخل السلة
export const updateCartItem = async (cartId, itemId, quantity) => {
  const response = await api.patch(  `/carts/${cartId}/items/${itemId}`, {
    quantity
  })
  return response.data
}

// حذف عنصر من السلة
export const removeCartItem = async (cartId, itemId) => {
  const response = await api.delete(`/carts/${cartId}/items/${itemId}`)
  return response.data
}
