import { Layers } from 'lucide-react'

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-600/30">
            <Layers size={24} />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-navy-900">{title}</h1>
            <p className="text-sm text-slate-600">{subtitle}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">{children}</div>
      </div>
    </div>
  )
}
