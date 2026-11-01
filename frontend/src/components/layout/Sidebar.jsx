import { NavLink } from 'react-router-dom'
import { Home, FilePlus, FolderOpen, LayoutTemplate, LogOut, Settings, Layers, X } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'

const NAV_ITEMS = [
  { label: 'Home', to: '/', icon: Home, end: true },
  { label: 'New Project', to: '/new-project', icon: FilePlus },
  { label: 'My Projects', to: '/my-projects', icon: FolderOpen },
  { label: 'Templates', to: '/templates', icon: LayoutTemplate },
  { label: 'Settings', to: '/settings', icon: Settings },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-900/50 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-navy-800 text-white transition-transform duration-300 ease-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 shadow-md shadow-brand-900/40">
              <Layers size={20} />
            </div>
            <span className="text-base font-semibold tracking-tight">BlueprintGen AI</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-1.5 text-navy-600 transition-colors hover:bg-navy-700 hover:text-white lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-900/30'
                    : 'text-slate-300 hover:bg-navy-700 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-3 border-t border-navy-700 px-4 py-4">
          <div className="min-w-0 px-2">
            <p className="truncate text-sm font-medium text-white">{user?.name}</p>
            <p className="truncate text-xs text-slate-400">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-navy-700 hover:text-white"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>
    </>
  )
}
