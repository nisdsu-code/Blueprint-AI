import { Link } from 'react-router-dom'
import { Eye, Pencil } from 'lucide-react'
import StatusBadge from '../common/StatusBadge.jsx'
import { formatDate } from '../../utils/formatDate.js'

const actionLinkClass =
  'inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-brand-500 hover:text-brand-600'

export default function ProjectTable({ projects }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th scope="col" className="px-6 py-3">Project Name</th>
            <th scope="col" className="px-6 py-3">Category</th>
            <th scope="col" className="px-6 py-3">Last Updated</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {projects.map((project) => (
            <tr key={project.id} className="transition-colors hover:bg-slate-50">
              <td className="whitespace-nowrap px-6 py-4 font-medium text-navy-900">{project.name}</td>
              <td className="whitespace-nowrap px-6 py-4 text-slate-600">{project.category}</td>
              <td className="whitespace-nowrap px-6 py-4 text-slate-600">{formatDate(project.updatedAt)}</td>
              <td className="whitespace-nowrap px-6 py-4">
                <StatusBadge status={project.status} />
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex justify-end gap-2">
                  <Link to={`/projects/${project.id}`} className={actionLinkClass}>
                    <Eye size={14} />
                    View
                  </Link>
                  <Link to={`/projects/${project.id}/edit`} className={actionLinkClass}>
                    <Pencil size={14} />
                    Edit
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
