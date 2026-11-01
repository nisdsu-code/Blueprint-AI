import { apiClient } from './apiClient.js'

export async function registerAccount({ name, email, password }) {
  const { data } = await apiClient.post('/auth/register', { name, email, password })
  return data
}

export async function signIn({ email, password }) {
  const { data } = await apiClient.post('/auth/login', { email, password })
  return data
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get('/auth/me')
  return data.user
}
