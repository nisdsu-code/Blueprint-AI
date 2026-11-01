import { apiClient } from './apiClient.js'

export async function analyzeRequirement(details) {
  const { data } = await apiClient.post('/ai/analyze', details)
  return data.analysis
}
