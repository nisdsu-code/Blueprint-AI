import { AlertTriangle, Loader2, Trash2 } from 'lucide-react'

export default function DeleteProjectDialog({ projectName, onConfirm, onCancel, isDeleting, error }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-project-title"
        className="w-full max-w-md space-y-5 rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <AlertTriangle size={22} />
          </div>
          <div className="space-y-1">
            <h2 id="delete-project-title" className="text-lg font-semibold text-navy-900">
              Delete project?
            </h2>
            <p className="text-sm text-slate-600">
              <span className="font-medium text-navy-900">{projectName}</span> and its blueprint will be permanently
              deleted. This cannot be undone.
            </p>
          </div>
        </div>

        {error && (
          <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/25 transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
            {isDeleting ? 'Deleting...' : 'Delete project'}
          </button>
        </div>
      </div>
    </div>
  )
}
