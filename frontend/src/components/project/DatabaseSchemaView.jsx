import MermaidDiagram from './MermaidDiagram.jsx'
import { buildEntityDiagram } from '../../utils/blueprintDiagrams.js'

const CARDINALITY_LABELS = {
  one_to_one: 'one to one',
  one_to_many: 'one to many',
  many_to_many: 'many to many',
}

function TableCard({ table }) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 p-4">
      <div className="space-y-1">
        <h4 className="font-mono text-sm font-semibold text-navy-900">{table.name}</h4>
        <p className="text-sm text-slate-600">{table.purpose}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th className="py-2 pr-4 font-semibold">Column</th>
              <th className="py-2 pr-4 font-semibold">Type</th>
              <th className="py-2 font-semibold">Constraints</th>
            </tr>
          </thead>
          <tbody>
            {table.columns.map((column) => (
              <tr key={column.name} className="border-b border-slate-100 last:border-0">
                <td className="py-2 pr-4 font-mono text-xs text-slate-800">{column.name}</td>
                <td className="py-2 pr-4 font-mono text-xs text-slate-600">{column.data_type}</td>
                <td className="py-2 text-slate-600">{column.constraints || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function DatabaseSchemaView({ blueprint }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {blueprint.database_tables.map((table) => (
          <TableCard key={table.name} table={table} />
        ))}
      </div>

      {blueprint.relationships.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-navy-900">Relationships</h3>
          <ul className="space-y-1.5">
            {blueprint.relationships.map((relationship) => (
              <li key={`${relationship.from_table}-${relationship.to_table}-${relationship.description}`} className="text-sm text-slate-700">
                <span className="font-mono text-xs">{relationship.from_table}</span> to{' '}
                <span className="font-mono text-xs">{relationship.to_table}</span> (
                {CARDINALITY_LABELS[relationship.cardinality]}): {relationship.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-navy-900">Entity relationship diagram</h3>
        <MermaidDiagram source={buildEntityDiagram(blueprint)} label="Entity relationship diagram" />
      </div>
    </div>
  )
}
