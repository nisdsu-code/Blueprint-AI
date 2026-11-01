import { Link } from 'react-router-dom'
import { Loader2, Save, Sparkles, Wand2 } from 'lucide-react'
import { PROJECT_CATEGORIES, PROJECT_LIMITS } from '../../data/projectFormOptions.js'

const inputClass =
  'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20'

function fieldClass(hasError) {
  return `${inputClass} ${hasError ? 'border-red-300 focus:border-red-500' : 'border-slate-300 focus:border-brand-500'}`
}

export default function RequirementForm({
  values,
  errors,
  onFieldChange,
  onUseExample,
  onSubmit,
  onAnalyze,
  onGenerate,
  isSubmitting,
  isAnalyzing,
  isGenerating,
  serverError,
  submitLabel = 'Save Draft',
  cancelTo = '/',
}) {
  const handleFormSubmit = (event) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleFormSubmit} noValidate className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      {serverError && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-[1fr_200px]">
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">
            Project name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={onFieldChange}
            placeholder="e.g. Doctor Appointment System"
            maxLength={PROJECT_LIMITS.nameMax}
            className={fieldClass(Boolean(errors.name))}
          />
          {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="category" className="block text-sm font-medium text-slate-700">
            Category <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={onFieldChange}
            className={fieldClass(false)}
          >
            {PROJECT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="requirement" className="block text-sm font-medium text-slate-700">
            Describe your software idea
          </label>
          <button
            type="button"
            onClick={onUseExample}
            className="text-xs font-medium text-brand-600 transition-colors hover:text-brand-700"
          >
            Use an example
          </button>
        </div>
        <textarea
          id="requirement"
          name="requirement"
          rows={8}
          value={values.requirement}
          onChange={onFieldChange}
          placeholder="Explain who will use the system, what they need to do, and any rules that matter."
          maxLength={PROJECT_LIMITS.requirementMax}
          className={`${fieldClass(Boolean(errors.requirement))} resize-y leading-relaxed`}
        />
        <div className="flex items-start justify-between gap-4">
          {errors.requirement ? (
            <p className="text-xs text-red-600">{errors.requirement}</p>
          ) : (
            <p className="text-xs text-slate-500">Plain English is fine. You can refine the details later.</p>
          )}
          <p className="shrink-0 text-xs tabular-nums text-slate-400">
            {values.requirement.length}/{PROJECT_LIMITS.requirementMax}
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={isAnalyzing || isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {isAnalyzing ? 'Analyzing...' : 'Analyze Requirement'}
          </button>
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating || isAnalyzing || isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
            {isGenerating ? 'Generating...' : 'Generate Blueprint'}
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link to={cancelTo} className="text-center text-sm font-medium text-slate-600 hover:text-slate-900">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || isAnalyzing}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition-all hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSubmitting ? 'Saving...' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  )
}
