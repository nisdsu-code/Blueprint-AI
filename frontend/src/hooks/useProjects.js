import { useEffect, useState } from 'react'
import { listProjects } from '../services/projectService.js'
import { getErrorMessage } from '../services/apiClient.js'

export function useProjects() {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const result = await listProjects()
        if (!cancelled) setProjects(result)
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err, 'Could not load your projects. Please try again.'))
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { projects, isLoading, error }
}
