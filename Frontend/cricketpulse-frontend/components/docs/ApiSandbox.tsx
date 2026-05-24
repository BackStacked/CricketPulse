'use client'

import { useState } from 'react'
import { Play, AlertCircle, Wifi } from 'lucide-react'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { API_ENDPOINTS } from '@/lib/constants'

type Result = {
  status: number
  body: string
  durationMs: number
} | { error: string }

const DEFAULT_BODY = API_ENDPOINTS.find((e) => e.body)?.body ?? ''

export function ApiSandbox() {
  const [baseUrl, setBaseUrl] = useState('http://localhost:8000')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [requestBody, setRequestBody] = useState(DEFAULT_BODY)
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)

  const endpoint = API_ENDPOINTS[selectedIdx]

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx)
    setResult(null)
    setRequestBody(API_ENDPOINTS[idx].body ?? '')
  }

  const send = async () => {
    if (endpoint.method === 'WS') {
      setResult({ error: 'ws' })
      return
    }
    setLoading(true)
    setResult(null)
    const t0 = performance.now()
    try {
      const path = endpoint.path.includes('?')
        ? endpoint.path
        : endpoint.path
      const res = await fetch(`${baseUrl.replace(/\/$/, '')}${path}`, {
        method: endpoint.method,
        headers: endpoint.method === 'POST'
          ? { 'Content-Type': 'application/json' }
          : undefined,
        body: endpoint.method === 'POST' ? requestBody : undefined,
      })
      const text = await res.text()
      let pretty: string
      try { pretty = JSON.stringify(JSON.parse(text), null, 2) }
      catch { pretty = text }
      setResult({ status: res.status, body: pretty, durationMs: Math.round(performance.now() - t0) })
    } catch (e) {
      setResult({ error: String(e) })
    } finally {
      setLoading(false)
    }
  }

  const statusColor = (s: number) =>
    s < 300
      ? 'bg-green-950 text-green-400 border-green-800'
      : s < 500
        ? 'bg-amber-950 text-amber-400 border-amber-800'
        : 'bg-red-950 text-red-400 border-red-800'

  return (
    <div className="border border-background-border rounded-lg overflow-hidden">
      {/* header */}
      <div className="bg-background-surface px-4 py-3 border-b border-background-border flex items-center gap-2">
        <Play size={14} className="text-accent-green" aria-hidden="true" />
        <span className="text-sm font-semibold text-text-primary">Sandbox</span>
        <span className="text-xs text-text-muted">— fire live requests from this page</span>
      </div>

      <div className="p-4 space-y-3">
        {/* base url + endpoint row */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            aria-label="Base URL"
            spellCheck={false}
            className="font-mono text-xs bg-background-raised border border-background-border rounded px-3 py-2 text-text-primary flex-1 min-w-0 focus:outline-none focus:border-accent-primary/60 transition-colors"
          />
          <select
            value={selectedIdx}
            onChange={(e) => handleSelect(Number(e.target.value))}
            aria-label="Select endpoint"
            className="font-mono text-xs bg-background-raised border border-background-border rounded px-3 py-2 text-text-primary focus:outline-none focus:border-accent-primary/60 transition-colors shrink-0"
          >
            {API_ENDPOINTS.map((ep, i) => (
              <option key={ep.path} value={i}>
                {ep.method} {ep.path}
              </option>
            ))}
          </select>
        </div>

        {/* body editor — only for POST */}
        {endpoint.method === 'POST' && (
          <div>
            <p className="text-xs text-text-muted uppercase tracking-widest font-medium mb-1.5">
              Request body (JSON)
            </p>
            <textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              rows={7}
              spellCheck={false}
              aria-label="Request body"
              className="w-full font-mono text-xs bg-background-base border border-background-border rounded px-3 py-2 text-text-secondary focus:outline-none focus:border-accent-primary/60 transition-colors resize-y"
            />
          </div>
        )}

        {/* WS note */}
        {endpoint.method === 'WS' && (
          <div className="flex items-center gap-2 text-xs text-accent-amber bg-amber-950/20 border border-amber-800/30 rounded px-3 py-2">
            <Wifi size={13} aria-hidden="true" />
            <span>WebSocket — use the Live Dashboard or <code className="font-mono">wscat -c ws://localhost:8000/ws</code> to connect.</span>
          </div>
        )}

        {/* send button */}
        <button
          onClick={send}
          disabled={loading || endpoint.method === 'WS'}
          className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white text-sm font-medium rounded-lg hover:bg-accent-primary/90 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-primary"
        >
          {loading ? (
            <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
          ) : (
            <Play size={13} aria-hidden="true" />
          )}
          {loading ? 'Sending…' : endpoint.method === 'WS' ? 'N/A for WebSocket' : 'Send Request'}
        </button>

        {/* result */}
        {result && (
          <div className="space-y-2 pt-1">
            {'error' in result ? (
              result.error === 'ws' ? null : (
                <div className="flex items-start gap-2 text-xs text-accent-red bg-red-950/20 border border-red-800/30 rounded px-3 py-2">
                  <AlertCircle size={13} className="shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-mono break-all">{result.error}</span>
                </div>
              )
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${statusColor(result.status)}`}>
                    {result.status}
                  </span>
                  <span className="text-xs text-text-muted font-mono">{result.durationMs}ms</span>
                </div>
                <CodeBlock code={result.body || '(empty response)'} language="json" />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
