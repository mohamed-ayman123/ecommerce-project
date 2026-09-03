import api from './axios'

export const getStoreProducts = async (params = {}) => {
  const response = await api.get('/products', { params })
  return response.data
}

export const getFeaturedProducts = async () => {
  const response = await api.get('/products', { params: { featured: true } })
  return response.data
}

export const searchProducts = async (query) => {
  const response = await api.get('/products/search', { params: { q: query } })
  return response.data
}

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

export const addProductReview = async (productId, reviewData) => {
  const response = await api.post(`/products/${productId}/reviews`, reviewData)
  return response.data
}
