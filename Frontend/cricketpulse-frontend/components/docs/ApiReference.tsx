'use client'

import { useState } from 'react'
import { Code2 } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { ApiSandbox } from '@/components/docs/ApiSandbox'
import { API_ENDPOINTS } from '@/lib/constants'
import type { Endpoint } from '@/lib/constants'
import { API_EXAMPLES, LANGUAGES } from '@/lib/api-examples'
import type { Language } from '@/lib/api-examples'

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

function LangTabs({
  active,
  onChange,
}: {
  active: Language
  onChange: (l: Language) => void
}) {
  return (
    <div
      role="tablist"
      aria-label="Code language"
      className="flex flex-wrap gap-1 mb-4 p-1 bg-background-raised rounded-lg border border-background-border w-fit"
    >
      {LANGUAGES.map(({ id, label }) => (
        <button
          key={id}
          role="tab"
          aria-selected={active === id}
          onClick={() => onChange(id)}
          className={[
            'px-3 py-1 text-xs font-mono font-medium rounded transition-colors duration-150 focus-visible:outline focus-visible:outline-accent-primary',
            active === id
              ? 'bg-background-base text-text-primary border border-background-border shadow-sm'
              : 'text-text-muted hover:text-text-secondary',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export function ApiReference() {
  const [lang, setLang] = useState<Language>('curl')

  return (
    <section aria-labelledby="api-title" className="space-y-8">
      {/* heading */}
      <div>
        <SectionLabel icon={Code2}>REST + WebSocket</SectionLabel>
        <h2 id="api-title" className="text-2xl font-semibold tracking-tight text-text-primary">
          API Reference
        </h2>
        <p className="text-sm text-text-secondary mt-2">
          Base URL:{' '}
          <code className="font-mono text-accent-primary text-xs">http://localhost:8000</code>
          {' '}·{' '}
          Interactive Swagger docs:{' '}
          <code className="font-mono text-accent-primary text-xs">http://localhost:8000/docs</code>
        </p>
      </div>

      {/* sandbox */}
      <ApiSandbox />

      {/* endpoints */}
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-4">Endpoints</h3>

        {/* sticky language switcher */}
        <div className="sticky top-14 z-10 bg-background-base pt-1 pb-3">
          <LangTabs active={lang} onChange={setLang} />
        </div>

        <div className="flex flex-col gap-6">
          {API_ENDPOINTS.map((ep, i) => (
            <div
              key={ep.path}
              className="bg-background-surface border border-background-border rounded-lg overflow-hidden"
            >
              {/* endpoint header */}
              <div className="flex items-center gap-3 flex-wrap px-4 py-3 border-b border-background-border bg-background-raised">
                <MethodBadge method={ep.method} />
                <code className="font-mono text-sm text-text-primary">{ep.path}</code>
              </div>

              <div className="p-4 space-y-4">
                {/* description */}
                <p className="text-sm text-text-secondary leading-relaxed">{ep.description}</p>

                {/* code example */}
                <div>
                  <p className="text-xs text-text-muted mb-2 uppercase tracking-widest font-medium">
                    Example
                  </p>
                  <CodeBlock
                    code={API_EXAMPLES[i][lang]}
                    language={lang === 'curl' ? 'bash' : lang}
                  />
                </div>

                {/* request body schema */}
                {ep.body && (
                  <div>
                    <p className="text-xs text-text-muted mb-2 uppercase tracking-widest font-medium">
                      Request body
                    </p>
                    <CodeBlock code={ep.body} language="json" />
                  </div>
                )}

                {/* response schema */}
                <div>
                  <p className="text-xs text-text-muted mb-2 uppercase tracking-widest font-medium">
                    Response
                  </p>
                  <CodeBlock code={ep.response} language="json" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
