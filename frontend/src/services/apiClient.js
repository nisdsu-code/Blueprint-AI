import axios from 'axios'

const TOKEN_KEY = 'blueprintgen_token'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
})

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function getErrorMessage(error, fallback) {
  if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
    return 'Cannot reach the server. Please check your connection and try again.'
  }
  return error.response?.data?.message || fallback
}
