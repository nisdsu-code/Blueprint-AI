import { PROJECT_LIMITS } from '../data/projectFormOptions.js'

export function validateProjectDetails(values) {
  const errors = {}
  const name = values.name.trim()

  if (!name) {
    errors.name = 'Enter a project name'
  } else if (name.length > PROJECT_LIMITS.nameMax) {
    errors.name = `Keep the name to ${PROJECT_LIMITS.nameMax} characters or fewer`
  }

  if (values.requirement.trim().length < PROJECT_LIMITS.requirementMin) {
    errors.requirement = `Describe your idea in at least ${PROJECT_LIMITS.requirementMin} characters`
  }

  return errors
}
