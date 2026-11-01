import { Link } from 'react-router-dom'
import { CheckCircle2, Clock, FolderOpen, LayoutTemplate, Plus, Sparkles } from 'lucide-react'
import StatCard from '../components/common/StatCard.jsx'
import ProjectTable from '../components/project/ProjectTable.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useProjects } from '../hooks/useProjects.js'
import { EXAMPLE_REQUIREMENT } from '../data/projectFormOptions.js'

const RECENT_PROJECTS_LIMIT = 5

export default function DashboardPage() {
  const { user } = useAuth()
  const { projects, isLoading, error } = useProjects()
  const totalProjects = projects.length
  const completedProjects = projects.filter((project) => project.status === 'completed').length
  const inProgressProjects = projects.filter((project) => project.status === 'in-progress').length
  const recentProjects = projects.slice(0, RECENT_PROJECTS_LIMIT)

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">Welcome, {user?.name}</h1>
          <p className="max-w-xl text-slate-600">
            Turn your ideas into complete software blueprints. Describe what you want to build in plain English and
            get requirements, modules, database design, APIs, and a delivery roadmap.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/templates"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <LayoutTemplate size={18} />
            Use Templates
          </Link>
          <Link
            to="/new-project"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-600/25 transition-all hover:-translate-y-0.5 hover:bg-brand-700"
          >
            <Plus size={18} />
            Create New Project
          </Link>
        </div>
      </section>

      <section className="flex items-start gap-4 rounded-2xl border border-brand-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Sparkles size={20} />
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-semibold text-navy-900">Example idea</p>
          <p className="text-sm leading-relaxed text-slate-600">&ldquo;{EXAMPLE_REQUIREMENT}&rdquo;</p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Projects" value={totalProjects} icon={FolderOpen} tone="brand" />
        <StatCard label="Completed Projects" value={completedProjects} icon={CheckCircle2} tone="success" />
        <StatCard label="Projects In Progress" value={inProgressProjects} icon={Clock} tone="warning" />
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <h2 className="text-base font-semibold text-navy-900">Recent Projects</h2>
          <Link to="/my-projects" className="text-sm font-medium text-brand-600 transition-colors hover:text-brand-700">
            View all
          </Link>
        </div>

        {error && (
          <div role="alert" className="px-6 py-8 text-center text-sm text-red-700">
            {error}
          </div>
        )}

        {!error && isLoading && <div className="px-6 py-12 text-center text-sm text-slate-500">Loading projects...</div>}

        {!error && !isLoading && recentProjects.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-navy-900">No projects yet</p>
            <p className="mt-1 text-sm text-slate-500">Create your first project to see it listed here.</p>
          </div>
        )}

        {!error && !isLoading && recentProjects.length > 0 && <ProjectTable projects={recentProjects} />}
      </section>
    </div>
  )
}
