import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import ProjectTable from '../components/project/ProjectTable.jsx'
import { useProjects } from '../hooks/useProjects.js'

export default function MyProjectsPage() {
  const { projects, isLoading, error } = useProjects()

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">My Projects</h1>
          <p className="text-slate-600">Open, edit, and export the blueprints you have saved.</p>
        </div>
        <Link
          to="/new-project"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition-all hover:bg-brand-700"
        >
          <Plus size={18} />
          Create New Project
        </Link>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {error && (
          <div role="alert" className="px-6 py-8 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {!error && isLoading && <div className="px-6 py-12 text-center text-sm text-slate-500">Loading projects...</div>}

        {!error && !isLoading && projects.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-navy-900">No saved projects yet</p>
            <p className="mt-1 text-sm text-slate-500">Projects you save will appear here.</p>
          </div>
        )}

        {!error && !isLoading && projects.length > 0 && <ProjectTable projects={projects} />}
      </section>
    </div>
  )
}
