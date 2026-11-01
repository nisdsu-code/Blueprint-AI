import { httpError } from './httpError.js'

const MAX_NAME_LENGTH = 120
const MAX_CATEGORY_LENGTH = 60
const MIN_REQUIREMENT_LENGTH = 20
const MAX_REQUIREMENT_LENGTH = 5000
const MAX_CLARIFICATIONS = 8
const MAX_QUESTION_LENGTH = 300
const MAX_ANSWER_LENGTH = 1000
const MAX_BLUEPRINT_BYTES = 200000

function readClarifications(value) {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value) || value.length > MAX_CLARIFICATIONS) {
    throw httpError(400, 'Clarification answers are invalid')
  }

  return value
    .map((item) => ({
      question: typeof item?.question === 'string' ? item.question.trim() : '',
      answer: typeof item?.answer === 'string' ? item.answer.trim() : '',
    }))
    .filter((item) => item.answer)
    .map((item) => {
      if (!item.question || item.question.length > MAX_QUESTION_LENGTH) {
        throw httpError(400, 'Clarification question is invalid')
      }
      if (item.answer.length > MAX_ANSWER_LENGTH) {
        throw httpError(400, `Clarification answers must be ${MAX_ANSWER_LENGTH} characters or fewer`)
      }
      return item
    })
}

function readBlueprint(value) {
  if (value === undefined || value === null) return null
  if (typeof value !== 'object' || Array.isArray(value)) throw httpError(400, 'Blueprint data is invalid')
  if (JSON.stringify(value).length > MAX_BLUEPRINT_BYTES) throw httpError(400, 'Blueprint is too large to save')
  return value
}

export function readProjectInput(body) {
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const category = typeof body?.category === 'string' ? body.category.trim() : ''
  const requirement = typeof body?.requirement === 'string' ? body.requirement.trim() : ''

  if (!name) throw httpError(400, 'Project name is required')
  if (name.length > MAX_NAME_LENGTH) throw httpError(400, `Project name must be ${MAX_NAME_LENGTH} characters or fewer`)
  if (category.length > MAX_CATEGORY_LENGTH) throw httpError(400, 'Category is too long')
  if (requirement.length < MIN_REQUIREMENT_LENGTH) {
    throw httpError(400, `Describe your idea in at least ${MIN_REQUIREMENT_LENGTH} characters`)
  }
  if (requirement.length > MAX_REQUIREMENT_LENGTH) {
    throw httpError(400, `Requirement must be ${MAX_REQUIREMENT_LENGTH} characters or fewer`)
  }

  return {
    name,
    category: category || 'General',
    requirement,
    clarifications: readClarifications(body.clarifications),
    blueprint: readBlueprint(body.blueprint),
  }
}
