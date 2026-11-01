import { apiClient } from './apiClient.js'

export async function generateBlueprint(details) {
  const { data } = await apiClient.post('/ai/blueprint', details)
  return data.blueprint
}
