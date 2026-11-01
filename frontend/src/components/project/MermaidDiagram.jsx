import { useEffect, useId, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'neutral' })

export default function MermaidDiagram({ source, label }) {
  const reactId = useId().replace(/[^A-Za-z0-9]/g, '')
  const [svg, setSvg] = useState('')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    const renderId = `mermaid-${reactId}-${Math.random().toString(36).slice(2, 8)}`

    mermaid
      .render(renderId, source)
      .then(({ svg: rendered }) => {
        if (cancelled) return
        setSvg(rendered)
        setFailed(false)
      })
      .catch(() => {
        document.getElementById(`d${renderId}`)?.remove()
        if (cancelled) return
        setSvg('')
        setFailed(true)
      })

    return () => {
      cancelled = true
    }
  }, [reactId, source])

  if (failed) {
    return (
      <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm text-amber-800">{label} could not be drawn. The diagram source is shown below.</p>
        <pre className="overflow-x-auto whitespace-pre text-xs text-slate-700">{source}</pre>
      </div>
    )
  }

  if (!svg) {
    return <p className="text-sm text-slate-500">Drawing {label.toLowerCase()}...</p>
  }

  return (
    <div
      role="img"
      aria-label={label}
      className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 [&_svg]:mx-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
