export const STATUS_LABELS = {
  draft: 'Draft',
  'in-progress': 'In Progress',
  completed: 'Completed',
}

const STATUS_STYLES = {
  completed: { label: STATUS_LABELS.completed, className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
  'in-progress': { label: STATUS_LABELS['in-progress'], className: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
  draft: { label: STATUS_LABELS.draft, className: 'bg-slate-100 text-slate-600 ring-slate-500/20' },
}

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.draft

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style.className}`}
    >
      {style.label}
    </span>
  )
}
