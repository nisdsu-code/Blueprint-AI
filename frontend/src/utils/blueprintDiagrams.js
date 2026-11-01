const CARDINALITY_SYMBOLS = {
  one_to_one: '||--||',
  one_to_many: '||--o{',
  many_to_many: '}o--o{',
}

const KEY_MARKERS = [
  ['primary key', 'PK'],
  ['foreign key', 'FK'],
  ['unique', 'UK'],
]

function toLabel(text) {
  return String(text)
    .replace(/["<>\r\n]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function toIdentifier(text, fallback) {
  const cleaned = String(text)
    .replace(/[^A-Za-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
  return cleaned || fallback
}

function keyMarkers(constraints) {
  const text = (constraints || '').toLowerCase()
  return KEY_MARKERS.filter(([phrase]) => text.includes(phrase)).map(([, marker]) => marker)
}

export function buildArchitectureDiagram(blueprint) {
  const componentIds = new Map()
  const lines = ['flowchart LR']

  blueprint.architecture_components.forEach((component, index) => {
    const id = `component_${index}`
    componentIds.set(component.name, id)
    lines.push(`  ${id}["${toLabel(component.name)}"]`)
  })

  blueprint.architecture_links.forEach((link) => {
    const from = componentIds.get(link.from_component)
    const to = componentIds.get(link.to_component)
    if (from && to) lines.push(`  ${from} -->|"${toLabel(link.label)}"| ${to}`)
  })

  return lines.join('\n')
}

export function buildEntityDiagram(blueprint) {
  const tableNames = new Set(blueprint.database_tables.map((table) => toIdentifier(table.name, 'table')))
  const lines = ['erDiagram']

  blueprint.database_tables.forEach((table) => {
    lines.push(`  ${toIdentifier(table.name, 'table')} {`)
    table.columns.forEach((column) => {
      const markers = keyMarkers(column.constraints)
      const suffix = markers.length > 0 ? ` ${markers.join(', ')}` : ''
      lines.push(`    ${toIdentifier(column.data_type, 'text')} ${toIdentifier(column.name, 'column')}${suffix}`)
    })
    lines.push('  }')
  })

  blueprint.relationships.forEach((relationship) => {
    const from = toIdentifier(relationship.from_table, 'table')
    const to = toIdentifier(relationship.to_table, 'table')
    if (!tableNames.has(from) || !tableNames.has(to)) return
    const symbol = CARDINALITY_SYMBOLS[relationship.cardinality] || CARDINALITY_SYMBOLS.one_to_many
    lines.push(`  ${from} ${symbol} ${to} : "${toLabel(relationship.description)}"`)
  })

  return lines.join('\n')
}
