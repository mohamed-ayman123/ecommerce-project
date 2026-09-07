import api from './axios'

export const getAllUsers = async (params = {}) => {
  const response = await api.get('/users/all', { params })
  return response.data
}

export const addAdminUser = async (userData) => {
  const response = await api.post('/users/add', userData)
  return response.data
}

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`)
  return response.data
}
