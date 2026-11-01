import { jsPDF } from 'jspdf'
import { STATUS_LABELS } from '../components/common/StatusBadge.jsx'
import { formatDate } from './formatDate.js'

const MARGIN = 48
const FONT = 'helvetica'

function createWriter(doc) {
  const pageHeight = doc.internal.pageSize.getHeight()
  const maxWidth = doc.internal.pageSize.getWidth() - MARGIN * 2
  let y = MARGIN

  const writeText = (text, { style = 'normal', size = 10, indent = 0, gapAfter = 4 } = {}) => {
    doc.setFont(FONT, style)
    doc.setFontSize(size)
    const lines = doc.splitTextToSize(String(text), maxWidth - indent)

    lines.forEach((line) => {
      if (y + size > pageHeight - MARGIN) {
        doc.addPage()
        y = MARGIN
      }
      doc.text(line, MARGIN + indent, y)
      y += size + 4
    })
    y += gapAfter
  }

  const writeHeading = (text) => {
    y += 10
    writeText(text, { style: 'bold', size: 13, gapAfter: 4 })
  }

  const writeBullet = (text) => writeText(`- ${text}`, { indent: 12, gapAfter: 2 })

  return { writeText, writeHeading, writeBullet }
}

function writeBlueprint(writer, blueprint) {
  writer.writeHeading('Software requirements document')
  blueprint.document_sections.forEach((section) => {
    writer.writeText(section.title, { style: 'bold', gapAfter: 2 })
    section.content.forEach((item) => writer.writeBullet(item))
  })

  writer.writeHeading('Architecture')
  blueprint.architecture_components.forEach((component) => {
    writer.writeText(`${component.name} (${component.technology})`, { style: 'bold', gapAfter: 0 })
    writer.writeText(component.responsibility, { indent: 12, gapAfter: 6 })
  })
  blueprint.architecture_links.forEach((link) => {
    writer.writeBullet(`${link.from_component} to ${link.to_component}: ${link.label}`)
  })

  writer.writeHeading('Database schema')
  blueprint.database_tables.forEach((table) => {
    writer.writeText(table.name, { style: 'bold', gapAfter: 0 })
    writer.writeText(table.purpose, { indent: 12, gapAfter: 2 })
    table.columns.forEach((column) => {
      writer.writeBullet(`${column.name} (${column.data_type})${column.constraints ? `: ${column.constraints}` : ''}`)
    })
  })
  blueprint.relationships.forEach((relationship) => {
    writer.writeBullet(
      `${relationship.from_table} to ${relationship.to_table} (${relationship.cardinality.replaceAll('_', ' ')}): ${relationship.description}`,
    )
  })
}

function addPageNumbers(doc) {
  const pageCount = doc.getNumberOfPages()
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page)
    doc.setFont(FONT, 'normal')
    doc.setFontSize(9)
    doc.text(`Page ${page} of ${pageCount}`, doc.internal.pageSize.getWidth() - MARGIN, doc.internal.pageSize.getHeight() - 24, {
      align: 'right',
    })
  }
}

export function downloadProjectPdf(project) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const writer = createWriter(doc)

  writer.writeText(project.name, { style: 'bold', size: 20, gapAfter: 4 })
  writer.writeText(
    `${project.category} | ${STATUS_LABELS[project.status]} | Last updated ${formatDate(project.updatedAt)}`,
    { size: 10, gapAfter: 12 },
  )

  writer.writeHeading('Requirement')
  writer.writeText(project.requirement, { gapAfter: 8 })

  if (project.clarifications.length > 0) {
    writer.writeHeading('Clarifications')
    project.clarifications.forEach((item) => {
      writer.writeText(item.question, { style: 'bold', gapAfter: 0 })
      writer.writeText(item.answer, { indent: 12, gapAfter: 6 })
    })
  }

  if (project.blueprint) writeBlueprint(writer, project.blueprint)

  addPageNumbers(doc)

  const fileName = project.name.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'project'
  doc.save(`${fileName}-blueprint.pdf`)
}
