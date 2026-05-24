'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language?: string
}

export function CodeBlock({ code, language = 'json' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const lines = code.split('\n')

  return (
    <div className="relative bg-background-base border border-background-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-background-border">
        <span className="text-xs font-mono text-text-muted uppercase tracking-widest">{language}</span>
        <button
          onClick={handleCopy}
          aria-label={copied ? 'Copied to clipboard' : 'Copy code'}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors duration-150 focus-visible:outline focus-visible:outline-accent-primary rounded px-1"
        >
          {copied ? (
            <Check size={14} aria-hidden="true" className="text-accent-green" />
          ) : (
            <Copy size={14} aria-hidden="true" />
          )}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <div className="overflow-x-auto p-4">
        <table className="w-full text-left">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i}>
                <td className="pr-4 text-text-muted font-mono text-xs select-none w-8 text-right">{i + 1}</td>
                <td className="font-mono text-xs text-text-secondary whitespace-pre">{line}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
