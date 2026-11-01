import { Info } from 'lucide-react'
import MermaidDiagram from './MermaidDiagram.jsx'
import DatabaseSchemaView from './DatabaseSchemaView.jsx'
import { buildArchitectureDiagram } from '../../utils/blueprintDiagrams.js'

function ComponentCard({ component }) {
  return (
    <div className="space-y-1.5 rounded-xl border border-slate-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-navy-900">{component.name}</h4>
        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
          {component.technology}
        </span>
      </div>
      <p className="text-sm text-slate-600">{component.responsibility}</p>
    </div>
  )
}

function SectionHeading({ children }) {
  return <h3 className="text-base font-semibold text-navy-900">{children}</h3>
}

export default function BlueprintPanel({ blueprint }) {
  return (
    <section className="space-y-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-navy-900">Project blueprint</h2>
        {blueprint.is_demo && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
            <Info size={12} />
            Demo mode
          </span>
        )}
      </div>

      <div className="space-y-6">
        <SectionHeading>Software requirements document</SectionHeading>
        {blueprint.document_sections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h4 className="text-sm font-semibold text-slate-800">{section.title}</h4>
            <ul className="space-y-1.5">
              {section.content.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <SectionHeading>Architecture</SectionHeading>
        <div className="grid gap-4 md:grid-cols-2">
          {blueprint.architecture_components.map((component) => (
            <ComponentCard key={component.name} component={component} />
          ))}
        </div>
        <MermaidDiagram source={buildArchitectureDiagram(blueprint)} label="Architecture diagram" />
      </div>

      <div className="space-y-6">
        <SectionHeading>Database schema</SectionHeading>
        <DatabaseSchemaView blueprint={blueprint} />
      </div>
    </section>
  )
}
