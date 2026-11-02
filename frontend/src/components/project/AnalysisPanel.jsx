import { AlertTriangle, Info } from 'lucide-react'
import ClarificationQuestions from './ClarificationQuestions.jsx'

function AnalysisSection({ title, items, tone = 'default' }) {
  if (!items || items.length === 0) return null

  const bulletClass = tone === 'warning' ? 'bg-amber-500' : 'bg-brand-500'

  return (
    <div className="space-y-2">
      {title && <h3 className="text-sm font-semibold text-navy-900">{title}</h3>}
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-700">
            <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${bulletClass}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function AnalysisPanel({ analysis, answers, onAnswerChange, onUpdate, isAnalyzing }) {
  return (
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold text-navy-900">Requirement analysis</h2>
          {analysis.is_demo && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
              <Info size={12} />
              Demo mode
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed text-slate-600">{analysis.summary}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AnalysisSection title="Objectives" items={analysis.objectives} />
        <AnalysisSection title="Main functionalities" items={analysis.main_functionalities} />
        <AnalysisSection title="User roles" items={analysis.user_roles} />
        <AnalysisSection title="Technical considerations" items={analysis.technical_considerations} />
      </div>

      {analysis.missing_information?.length > 0 && (
        <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
            <AlertTriangle size={16} />
            Missing information
          </div>
          <AnalysisSection title="" items={analysis.missing_information} tone="warning" />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <AnalysisSection title="Ambiguities" items={analysis.ambiguities} tone="warning" />
        <AnalysisSection title="Assumptions (not stated by you)" items={analysis.assumptions} />
      </div>

      <ClarificationQuestions
        questions={analysis.clarification_questions}
        answers={answers}
        onAnswerChange={onAnswerChange}
        onUpdate={onUpdate}
        isAnalyzing={isAnalyzing}
      />
    </section>
  )
}
