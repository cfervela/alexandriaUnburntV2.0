import axios from 'axios'
import { API_BASE_URL } from '../config'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 responses globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('cart')
      // Redirect to login unless already there
      const base = import.meta.env.BASE_URL || '/'
      if (window.location.pathname !== `${base}login`) {
        window.location.href = `${base}login`
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
