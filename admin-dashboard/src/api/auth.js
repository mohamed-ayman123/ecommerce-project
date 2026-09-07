import api from './axios'

export const loginAdmin = async (credentials) => {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

export const getMe = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

export const logoutAdmin = async () => {
  try {
    await api.post('/auth/logout')
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}
