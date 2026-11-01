import { apiClient } from './apiClient.js'

export async function listProjects() {
  const { data } = await apiClient.get('/projects')
  return data.projects
}

export async function getProject(id) {
  const { data } = await apiClient.get(`/projects/${id}`)
  return data.project
}

export async function createProject(details) {
  const { data } = await apiClient.post('/projects', details)
  return data.project
}

export async function updateProject(id, details) {
  const { data } = await apiClient.put(`/projects/${id}`, details)
  return data.project
}

export async function deleteProject(id) {
  await apiClient.delete(`/projects/${id}`)
}
