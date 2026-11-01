import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Layers, Menu } from 'lucide-react'
import Sidebar from './Sidebar.jsx'

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex min-h-screen flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open navigation"
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-white">
              <Layers size={16} />
            </div>
            <span className="font-semibold text-navy-800">BlueprintGen AI</span>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
