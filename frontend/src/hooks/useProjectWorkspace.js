import { useState } from 'react'
import { EXAMPLE_REQUIREMENT } from '../data/projectFormOptions.js'
import { analyzeRequirement } from '../services/analysisService.js'
import { generateBlueprint } from '../services/blueprintService.js'
import { getErrorMessage } from '../services/apiClient.js'
import { validateProjectDetails } from '../utils/validateProjectDetails.js'

export function useProjectWorkspace({ initialValues, initialAnswers = {}, initialBlueprint = null }) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [answers, setAnswers] = useState(initialAnswers)
  const [analysis, setAnalysis] = useState(null)
  const [analysisError, setAnalysisError] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [blueprint, setBlueprint] = useState(initialBlueprint)
  const [blueprintError, setBlueprintError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => ({ ...previous, [name]: undefined }))
  }

  const handleUseExample = () => {
    setValues((previous) => ({ ...previous, requirement: EXAMPLE_REQUIREMENT }))
    setErrors((previous) => ({ ...previous, requirement: undefined }))
  }

  const handleAnswerChange = (question, answer) => {
    setAnswers((previous) => ({ ...previous, [question]: answer }))
  }

  const getAnsweredClarifications = () =>
    Object.entries(answers)
      .map(([question, answer]) => ({ question, answer: answer.trim() }))
      .filter((item) => item.answer)

  const getValidDetails = () => {
    const validationErrors = validateProjectDetails(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return null

    return {
      name: values.name.trim(),
      category: values.category,
      requirement: values.requirement.trim(),
      clarifications: getAnsweredClarifications(),
    }
  }

  const handleAnalyze = async () => {
    const details = getValidDetails()
    if (!details) return

    setAnalysisError('')
    setIsAnalyzing(true)

    try {
      setAnalysis(await analyzeRequirement(details))
    } catch (error) {
      setAnalysis(null)
      setAnalysisError(getErrorMessage(error, 'Could not analyze your requirement. Please try again.'))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGenerate = async () => {
    const details = getValidDetails()
    if (!details) return

    setBlueprintError('')
    setIsGenerating(true)

    try {
      setBlueprint(await generateBlueprint(details))
    } catch (error) {
      setBlueprint(null)
      setBlueprintError(getErrorMessage(error, 'Could not generate the blueprint. Please try again.'))
    } finally {
      setIsGenerating(false)
    }
  }

  const resetWorkspace = () => {
    setValues(initialValues)
    setErrors({})
    setAnswers(initialAnswers)
    setAnalysis(null)
    setAnalysisError('')
    setBlueprint(initialBlueprint)
    setBlueprintError('')
  }

  return {
    values,
    errors,
    answers,
    analysis,
    analysisError,
    isAnalyzing,
    blueprint,
    blueprintError,
    isGenerating,
    handleFieldChange,
    handleUseExample,
    handleAnswerChange,
    handleAnalyze,
    handleGenerate,
    getValidDetails,
    resetWorkspace,
  }
}
