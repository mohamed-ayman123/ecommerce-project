import api from './axios'

export const sendRegisterOtp = async (userData) => {
  const response = await api.post('/auth/register/send-otp', userData)
  return response.data
}

export const verifyOtp = async (otpData) => {
  const response = await api.post('/auth/verify-otp', otpData)
  return response.data
}

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

export const sendForgotPasswordOtp = async (emailData) => {
  const response = await api.post('/auth/forgot-password/send-otp', emailData)
  return response.data
}

export const getMe = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

export const logoutUser = async () => {
  try {
    await api.post('/auth/logout')
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}
