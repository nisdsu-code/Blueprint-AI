import { CircleHelp, RefreshCw } from 'lucide-react'

const answerInputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20'

export default function ClarificationQuestions({ questions, answers, onAnswerChange, onUpdate, isAnalyzing }) {
  if (questions.length === 0) return null

  const answeredCount = Object.values(answers).filter((answer) => answer.trim()).length

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-navy-900">
          <CircleHelp size={16} className="text-brand-600" />
          Clarification questions
        </div>
        <p className="text-sm text-slate-600">
          Answer any you can. Your answers are added to the requirement when you update the analysis.
        </p>
      </div>

      <ol className="space-y-4">
        {questions.map((item, index) => (
          <li key={item.question} className="space-y-2 rounded-lg border border-slate-200 p-4">
            <label htmlFor={`clarification-${index}`} className="block text-sm font-medium text-navy-900">
              {index + 1}. {item.question}
            </label>
            <p className="text-xs text-slate-500">{item.reason}</p>
            <textarea
              id={`clarification-${index}`}
              rows={2}
              maxLength={1000}
              value={answers[item.question] || ''}
              onChange={(event) => onAnswerChange(item.question, event.target.value)}
              placeholder="Your answer (optional)"
              className={answerInputClass}
            />
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">{answeredCount} answered</p>
        <button
          type="button"
          onClick={onUpdate}
          disabled={isAnalyzing || answeredCount === 0}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition-all hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={16} className={isAnalyzing ? 'animate-spin' : ''} />
          {isAnalyzing ? 'Updating...' : 'Update analysis with answers'}
        </button>
      </div>
    </div>
  )
}
