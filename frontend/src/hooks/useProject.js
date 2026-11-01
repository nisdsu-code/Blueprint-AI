import { useEffect, useState } from 'react'
import { getProject } from '../services/projectService.js'
import { getErrorMessage } from '../services/apiClient.js'

export function useProject(id) {
  const [project, setProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const result = await getProject(id)
        if (!cancelled) setProject(result)
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, 'Could not load this project. Please try again.'))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  return { project, isLoading, error }
}
