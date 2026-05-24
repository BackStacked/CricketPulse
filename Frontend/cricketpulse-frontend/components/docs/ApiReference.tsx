'use client'

import { Code2 } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { API_ENDPOINTS } from '@/lib/constants'
import type { Endpoint } from '@/lib/constants'

function MethodBadge({ method }: { method: Endpoint['method'] }) {
  const styles: Record<Endpoint['method'], string> = {
    GET:  'bg-green-950 text-green-400 border-green-800',
    POST: 'bg-indigo-950 text-indigo-400 border-indigo-800',
    WS:   'bg-amber-950 text-amber-400 border-amber-800',
  }
  return (
    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${styles[method]}`}>
      {method}
    </span>
  )
}

export function ApiReference() {
  return (
    <section aria-labelledby="api-title" className="space-y-6">
      <div>
        <SectionLabel icon={Code2}>REST + WebSocket</SectionLabel>
        <h2 id="api-title" className="text-2xl font-semibold tracking-tight text-text-primary">
          API Reference
        </h2>
        <p className="text-sm text-text-secondary mt-2">
          Base URL: <code className="font-mono text-accent-primary text-xs">http://localhost:8000</code>
          {' '}· Interactive docs: <code className="font-mono text-accent-primary text-xs">http://localhost:8000/docs</code>
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {API_ENDPOINTS.map((ep) => (
          <div
            key={ep.path}
            className="bg-background-surface border border-background-border rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <MethodBadge method={ep.method} />
              <code className="font-mono text-sm text-text-primary">{ep.path}</code>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{ep.description}</p>
            {ep.body && (
              <div>
                <p className="text-xs text-text-muted mb-2 uppercase tracking-widest font-medium">Request body</p>
                <CodeBlock code={ep.body} language="json" />
              </div>
            )}
            <div>
              <p className="text-xs text-text-muted mb-2 uppercase tracking-widest font-medium">Response</p>
              <CodeBlock code={ep.response} language="json" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
