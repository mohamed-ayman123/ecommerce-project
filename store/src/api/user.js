import api from './axios'

export const getUserProfile = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

export const updateUserProfile = async (id, userData) => {
  const response = await api.patch(`/users/${id}`, userData)
  return response.data
}
