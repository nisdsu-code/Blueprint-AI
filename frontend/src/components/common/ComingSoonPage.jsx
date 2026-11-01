import { Construction } from 'lucide-react'

export default function ComingSoonPage({ title, description }) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">{title}</h1>
        <p className="text-slate-600">{description}</p>
      </div>
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <Construction size={26} />
        </div>
        <p className="font-semibold text-navy-900">This page is being built</p>
        <p className="mt-1 max-w-sm text-sm text-slate-500">It will be fully functional in an upcoming development phase.</p>
      </div>
    </div>
  )
}
