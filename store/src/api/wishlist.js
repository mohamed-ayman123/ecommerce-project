import api from './axios'

export const getMyWishlist = async () => {
  const response = await api.get('/wishlists/my')
  return response.data
}

export const addToWishlistApi = async (productId) => {
  const response = await api.post(`/wishlists/add/${productId}`)
  return response.data
}

export const removeFromWishlistApi = async (productId) => {
  const response = await api.delete(`/wishlists/remove/${productId}`)
  return response.data
}

export const clearWishlistApi = async () => {
  const response = await api.delete('/wishlists/clear')
  return response.data
}
