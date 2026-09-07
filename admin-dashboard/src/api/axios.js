import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://e-commerce-api-3wara.vercel.app'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

// Request Interceptor: Attach token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (!window.location.pathname.startsWith('/login')) {
        window.location.replace('/login')
      }
    }
    return Promise.reject(error)
  }
)

export default api