import { env } from '../config/env.js'
import { httpError } from '../utils/httpError.js'

const AI_REQUEST_TIMEOUT_MS = 120000

async function callAiService(path, details) {
  let response
  try {
    response = await fetch(`${env.aiServiceUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Service-Token': env.aiServiceToken,
      },
      body: JSON.stringify(details),
      signal: AbortSignal.timeout(AI_REQUEST_TIMEOUT_MS),
    })
  } catch (error) {
    console.error(`AI service request to ${path} failed: ${error.cause?.code || error.name}: ${error.cause?.message || error.message}`)
    throw httpError(503, 'The AI service is unavailable right now. Please try again shortly.')
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const detail = typeof data?.detail === 'string' ? data.detail : null

    if (response.status === 429) throw httpError(429, detail || 'Too many requests. Please wait and try again.')
    if (response.status === 400 || response.status === 422) {
      throw httpError(400, 'The requirement could not be processed. Please check your input.')
    }
    throw httpError(502, detail || 'The AI service could not process your requirement.')
  }

  return data
}

export function analyzeRequirement(details) {
  return callAiService('/analyze', details)
}

export function generateBlueprint(details) {
  return callAiService('/blueprint', details)
}
