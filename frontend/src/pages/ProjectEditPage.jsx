import { useParams } from 'react-router-dom'
import ProjectEditForm from '../components/project/ProjectEditForm.jsx'
import { useProject } from '../hooks/useProject.js'

export default function ProjectEditPage() {
  const { id } = useParams()
  const { project, isLoading, error } = useProject(id)

  if (isLoading) {
    return <div className="px-6 py-12 text-center text-sm text-slate-500">Loading project...</div>
  }

  if (error || !project) {
    return (
      <div role="alert" className="mx-auto max-w-3xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error || 'Project not found.'}
      </div>
    )
  }

  return <ProjectEditForm key={project.id} project={project} />
}
