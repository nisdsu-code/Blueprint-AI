import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Download, Pencil, Trash2 } from 'lucide-react'
import BlueprintPanel from '../components/project/BlueprintPanel.jsx'
import DeleteProjectDialog from '../components/project/DeleteProjectDialog.jsx'
import StatusBadge from '../components/common/StatusBadge.jsx'
import { useProject } from '../hooks/useProject.js'
import { deleteProject } from '../services/projectService.js'
import { getErrorMessage } from '../services/apiClient.js'
import { formatDate } from '../utils/formatDate.js'
import { downloadProjectPdf } from '../utils/blueprintPdf.js'

const secondaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { project, isLoading, error } = useProject(id)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const handleDelete = async () => {
    setDeleteError('')
    setIsDeleting(true)

    try {
      await deleteProject(project.id)
      navigate('/my-projects')
    } catch (err) {
      setDeleteError(getErrorMessage(err, 'Could not delete this project. Please try again.'))
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return <div className="px-6 py-12 text-center text-sm text-slate-500">Loading project...</div>
  }

  if (error || !project) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || 'Project not found.'}
        </div>
        <Link to="/my-projects" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          Back to my projects
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Link to="/my-projects" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900">
        <ArrowLeft size={16} />
        My projects
      </Link>

      <section className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">{project.name}</h1>
            <StatusBadge status={project.status} />
          </div>
          <p className="text-sm text-slate-600">
            {project.category} | Last updated {formatDate(project.updatedAt)}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to={`/projects/${project.id}/edit`}
            className={secondaryButtonClass}
          >
            <Pencil size={18} />
            Edit
          </Link>
          <button type="button" onClick={() => downloadProjectPdf(project)} className={secondaryButtonClass}>
            <Download size={18} />
            Export PDF
          </button>
          <button
            type="button"
            onClick={() => setIsConfirmingDelete(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-50"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <h2 className="text-base font-semibold text-navy-900">Requirement</h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{project.requirement}</p>
      </section>

      {project.clarifications.length > 0 && (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="text-base font-semibold text-navy-900">Clarifications</h2>
          <dl className="space-y-4">
            {project.clarifications.map((item) => (
              <div key={item.question} className="space-y-1">
                <dt className="text-sm font-medium text-navy-900">{item.question}</dt>
                <dd className="text-sm text-slate-700">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {project.blueprint ? (
        <BlueprintPanel blueprint={project.blueprint} />
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center sm:p-8">
          <p className="font-medium text-navy-900">No blueprint yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Open the editor and click Generate Blueprint to create one for this project.
          </p>
        </section>
      )}
      {isConfirmingDelete && (
        <DeleteProjectDialog
          projectName={project.name}
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmingDelete(false)}
          isDeleting={isDeleting}
          error={deleteError}
        />
      )}
    </div>
  )
}
