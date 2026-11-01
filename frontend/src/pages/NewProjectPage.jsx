import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Plus } from 'lucide-react'
import RequirementForm from '../components/project/RequirementForm.jsx'
import AnalysisPanel from '../components/project/AnalysisPanel.jsx'
import BlueprintPanel from '../components/project/BlueprintPanel.jsx'
import { createProject } from '../services/projectService.js'
import { getErrorMessage } from '../services/apiClient.js'
import { useProjectWorkspace } from '../hooks/useProjectWorkspace.js'

const EMPTY_VALUES = { name: '', category: 'General', requirement: '' }

export default function NewProjectPage() {
  const workspace = useProjectWorkspace({ initialValues: EMPTY_VALUES })
  const [savedProject, setSavedProject] = useState(null)
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    const details = workspace.getValidDetails()
    if (!details) return

    setServerError('')
    setIsSubmitting(true)

    try {
      setSavedProject(await createProject({ ...details, blueprint: workspace.blueprint }))
    } catch (error) {
      setServerError(getErrorMessage(error, 'Could not save your project. Please try again.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateAnother = () => {
    workspace.resetWorkspace()
    setServerError('')
    setSavedProject(null)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">New Project</h1>
        <p className="text-slate-600">
          Describe your software idea in simple English. Analyze it, generate a blueprint, then save it to your account.
        </p>
      </div>

      {savedProject ? (
        <div className="space-y-6 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={24} />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-navy-900">Project saved</h2>
              <p className="text-sm text-slate-600">
                <span className="font-medium text-navy-900">{savedProject.name}</span> is saved as a draft in{' '}
                {savedProject.category}.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleCreateAnother}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition-all hover:bg-brand-700"
            >
              <Plus size={18} />
              Create another project
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      ) : (
        <RequirementForm
          values={workspace.values}
          errors={workspace.errors}
          onFieldChange={workspace.handleFieldChange}
          onUseExample={workspace.handleUseExample}
          onSubmit={handleSubmit}
          onAnalyze={workspace.handleAnalyze}
          onGenerate={workspace.handleGenerate}
          isSubmitting={isSubmitting}
          isAnalyzing={workspace.isAnalyzing}
          isGenerating={workspace.isGenerating}
          serverError={serverError}
        />
      )}

      {workspace.analysisError && !savedProject && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {workspace.analysisError}
        </div>
      )}

      {workspace.analysis && !savedProject && (
        <AnalysisPanel
          analysis={workspace.analysis}
          answers={workspace.answers}
          onAnswerChange={workspace.handleAnswerChange}
          onUpdate={workspace.handleAnalyze}
          isAnalyzing={workspace.isAnalyzing}
        />
      )}

      {workspace.blueprintError && !savedProject && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {workspace.blueprintError}
        </div>
      )}

      {workspace.blueprint && !savedProject && <BlueprintPanel blueprint={workspace.blueprint} />}
    </div>
  )
}
