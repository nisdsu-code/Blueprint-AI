import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RequirementForm from './RequirementForm.jsx'
import AnalysisPanel from './AnalysisPanel.jsx'
import BlueprintPanel from './BlueprintPanel.jsx'
import { STATUS_LABELS } from '../common/StatusBadge.jsx'
import { updateProject } from '../../services/projectService.js'
import { generateBlueprint } from '../../services/blueprintService.js'
import { getErrorMessage } from '../../services/apiClient.js'
import { useProjectWorkspace } from '../../hooks/useProjectWorkspace.js'

const selectClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:w-64'

function toAnswerMap(clarifications) {
  return Object.fromEntries(clarifications.map((item) => [item.question, item.answer]))
}

export default function ProjectEditForm({ project }) {
  const navigate = useNavigate()
  const workspace = useProjectWorkspace({
    initialValues: { name: project.name, category: project.category, requirement: project.requirement },
    initialAnswers: toAnswerMap(project.clarifications),
    initialBlueprint: project.blueprint,
  })
  const [status, setStatus] = useState(project.status)
  const [serverError, setServerError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const requirementChanged = workspace.values.requirement.trim() !== project.requirement

  const handleSave = async () => {
    const details = workspace.getValidDetails()
    if (!details) return

    setServerError('')
    setIsSaving(true)

    try {
      const blueprint = details.requirement === project.requirement ? workspace.blueprint : await generateBlueprint(details)
      await updateProject(project.id, { ...details, blueprint, status })
      navigate(`/projects/${project.id}`)
    } catch (error) {
      setServerError(
        getErrorMessage(
          error,
          'Could not save your changes. If you changed the requirement, the blueprint could not be regenerated. Please try again.',
        ),
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">Edit project</h1>
        <p className="text-slate-600">
          Update the details and run the analysis again. If you change the requirement, the blueprint is regenerated when
          you click Save changes.
        </p>
      </div>

      <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <label htmlFor="status" className="block text-sm font-medium text-slate-700">
          Status
        </label>
        <select id="status" value={status} onChange={(event) => setStatus(event.target.value)} className={selectClass}>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {isSaving && requirementChanged && (
        <p role="status" className="text-sm font-medium text-brand-700">
          Regenerating your blueprint for the updated requirement. This can take a moment...
        </p>
      )}

      <RequirementForm
        values={workspace.values}
        errors={workspace.errors}
        onFieldChange={workspace.handleFieldChange}
        onUseExample={workspace.handleUseExample}
        onSubmit={handleSave}
        onAnalyze={workspace.handleAnalyze}
        onGenerate={workspace.handleGenerate}
        isSubmitting={isSaving}
        isAnalyzing={workspace.isAnalyzing}
        isGenerating={workspace.isGenerating}
        serverError={serverError}
        submitLabel="Save changes"
        cancelTo={`/projects/${project.id}`}
      />

      {workspace.analysisError && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {workspace.analysisError}
        </div>
      )}

      {workspace.analysis && (
        <AnalysisPanel
          analysis={workspace.analysis}
          answers={workspace.answers}
          onAnswerChange={workspace.handleAnswerChange}
          onUpdate={workspace.handleAnalyze}
          isAnalyzing={workspace.isAnalyzing}
        />
      )}

      {workspace.blueprintError && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {workspace.blueprintError}
        </div>
      )}

      {workspace.blueprint && <BlueprintPanel blueprint={workspace.blueprint} />}
    </div>
  )
}
