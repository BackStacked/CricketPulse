'use client'

import { SectionLabel } from '@/components/ui/SectionLabel'
import { GitBranch } from 'lucide-react'

export function ArchitectureDiagram() {
  return (
    <section aria-labelledby="arch-title" className="space-y-6">
      <div>
        <SectionLabel icon={GitBranch}>System Architecture</SectionLabel>
        <h2 id="arch-title" className="text-2xl font-semibold tracking-tight text-text-primary mb-4">
          How It Works
        </h2>
      </div>

      <div className="bg-background-surface border border-background-border rounded-lg p-6 overflow-x-auto">
        <svg
          viewBox="0 0 780 400"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full max-w-3xl mx-auto"
          aria-label="CricketPulse system architecture diagram"
          role="img"
        >
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#525252" />
            </marker>
          </defs>

          {/* Row 1: Source → Emitter → Redis → Processor */}
          {/* Cricsheet JSON */}
          <rect x="10" y="20" width="120" height="40" rx="6" fill="#111111" stroke="#222222" />
          <text x="70" y="44" fontFamily="var(--font-geist-mono, monospace)" fontSize="10" fill="#A3A3A3" textAnchor="middle">Cricsheet JSON</text>

          {/* Arrow */}
          <line x1="130" y1="40" x2="168" y2="40" stroke="#525252" strokeWidth="1.5" markerEnd="url(#arrow)" />

          {/* emitter.py */}
          <rect x="170" y="20" width="110" height="40" rx="6" fill="#111111" stroke="#222222" />
          <text x="225" y="44" fontFamily="var(--font-geist-mono, monospace)" fontSize="10" fill="#A3A3A3" textAnchor="middle">emitter.py</text>

          {/* Arrow */}
          <line x1="280" y1="40" x2="318" y2="40" stroke="#525252" strokeWidth="1.5" markerEnd="url(#arrow)" />

          {/* Redis */}
          <rect x="320" y="20" width="110" height="40" rx="6" fill="#111111" stroke="#EF4444" />
          <text x="375" y="37" fontFamily="var(--font-geist-mono, monospace)" fontSize="10" fill="#A3A3A3" textAnchor="middle">Redis pub/sub</text>
          <text x="375" y="51" fontFamily="var(--font-geist-mono, monospace)" fontSize="9" fill="#525252" textAnchor="middle">match:events</text>

          {/* Arrow */}
          <line x1="430" y1="40" x2="468" y2="40" stroke="#525252" strokeWidth="1.5" markerEnd="url(#arrow)" />

          {/* Event Processor */}
          <rect x="470" y="10" width="130" height="60" rx="6" fill="#1A1A1A" stroke="#6366F1" />
          <text x="535" y="34" fontFamily="var(--font-geist-mono, monospace)" fontSize="10" fill="#A3A3A3" textAnchor="middle">Event Processor</text>
          <text x="535" y="50" fontFamily="var(--font-geist-mono, monospace)" fontSize="9" fill="#6366F1" textAnchor="middle">asyncio.gather()</text>
          <text x="535" y="63" fontFamily="var(--font-geist-mono, monospace)" fontSize="8" fill="#525252" textAnchor="middle">parallel agents</text>

          {/* Row 2: Three agents */}
          {/* Down arrow from processor */}
          <line x1="535" y1="70" x2="535" y2="118" stroke="#525252" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <line x1="535" y1="90" x2="210" y2="90" stroke="#525252" strokeWidth="1" />
          <line x1="210" y1="90" x2="210" y2="118" stroke="#525252" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <line x1="535" y1="90" x2="760" y2="90" stroke="#525252" strokeWidth="1" />
          <line x1="760" y1="90" x2="760" y2="118" stroke="#525252" strokeWidth="1.5" markerEnd="url(#arrow)" />

          {/* Win Prob Agent */}
          <rect x="110" y="120" width="140" height="50" rx="6" fill="#1A1A1A" stroke="#6366F1" />
          <text x="180" y="141" fontFamily="var(--font-geist-mono, monospace)" fontSize="10" fill="#A3A3A3" textAnchor="middle">Win Probability</text>
          <text x="180" y="155" fontFamily="var(--font-geist-mono, monospace)" fontSize="9" fill="#6366F1" textAnchor="middle">ML (XGBoost)</text>
          <text x="180" y="167" fontFamily="var(--font-geist-mono, monospace)" fontSize="8" fill="#525252" textAnchor="middle">81.7% acc</text>

          {/* Commentary Agent */}
          <rect x="465" y="120" width="140" height="50" rx="6" fill="#1A1A1A" stroke="#6366F1" />
          <text x="535" y="141" fontFamily="var(--font-geist-mono, monospace)" fontSize="10" fill="#A3A3A3" textAnchor="middle">Commentary</text>
          <text x="535" y="155" fontFamily="var(--font-geist-mono, monospace)" fontSize="9" fill="#6366F1" textAnchor="middle">Groq LLM</text>
          <text x="535" y="167" fontFamily="var(--font-geist-mono, monospace)" fontSize="8" fill="#525252" textAnchor="middle">llama-3.1-8b</text>

          {/* Alerts Agent */}
          <rect x="690" y="120" width="80" height="50" rx="6" fill="#1A1A1A" stroke="#6366F1" />
          <text x="730" y="141" fontFamily="var(--font-geist-mono, monospace)" fontSize="10" fill="#A3A3A3" textAnchor="middle">Alerts</text>
          <text x="730" y="155" fontFamily="var(--font-geist-mono, monospace)" fontSize="9" fill="#6366F1" textAnchor="middle">Rules+LLM</text>

          {/* Converge arrows */}
          <line x1="180" y1="170" x2="180" y2="220" stroke="#525252" strokeWidth="1" />
          <line x1="180" y1="220" x2="535" y2="220" stroke="#525252" strokeWidth="1" />
          <line x1="730" y1="170" x2="730" y2="220" stroke="#525252" strokeWidth="1" />
          <line x1="730" y1="220" x2="535" y2="220" stroke="#525252" strokeWidth="1" />
          <line x1="535" y1="220" x2="535" y2="248" stroke="#525252" strokeWidth="1.5" markerEnd="url(#arrow)" />

          {/* WebSocket Broadcast */}
          <rect x="440" y="250" width="190" height="40" rx="6" fill="#111111" stroke="#14B8A6" />
          <text x="535" y="267" fontFamily="var(--font-geist-mono, monospace)" fontSize="10" fill="#A3A3A3" textAnchor="middle">WebSocket broadcast</text>
          <text x="535" y="283" fontFamily="var(--font-geist-mono, monospace)" fontSize="9" fill="#14B8A6" textAnchor="middle">ws://localhost:8000/ws</text>

          {/* Down arrow */}
          <line x1="535" y1="290" x2="535" y2="318" stroke="#525252" strokeWidth="1.5" markerEnd="url(#arrow)" />

          {/* Browser */}
          <rect x="440" y="320" width="190" height="40" rx="6" fill="#111111" stroke="#22C55E" />
          <text x="535" y="340" fontFamily="var(--font-geist-mono, monospace)" fontSize="10" fill="#A3A3A3" textAnchor="middle">Browser Dashboard</text>
          <text x="535" y="354" fontFamily="var(--font-geist-mono, monospace)" fontSize="9" fill="#22C55E" textAnchor="middle">Next.js 16</text>

          {/* Postgres branch */}
          <line x1="440" y1="270" x2="360" y2="270" stroke="#525252" strokeWidth="1" />
          <line x1="360" y1="270" x2="360" y2="318" stroke="#525252" strokeWidth="1.5" markerEnd="url(#arrow)" />
          <rect x="280" y="320" width="120" height="40" rx="6" fill="#111111" stroke="#222222" />
          <text x="340" y="337" fontFamily="var(--font-geist-mono, monospace)" fontSize="10" fill="#A3A3A3" textAnchor="middle">PostgreSQL</text>
          <text x="340" y="351" fontFamily="var(--font-geist-mono, monospace)" fontSize="9" fill="#525252" textAnchor="middle">Audit Log</text>
        </svg>
      </div>

      {/* Stat pills */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'asyncio.gather()', desc: 'Parallel agent execution' },
          { label: 'Redis pub/sub', desc: 'Zero-latency fan-out' },
          { label: '< 1s end-to-end', desc: 'Ball to browser' },
        ].map(({ label, desc }) => (
          <div
            key={label}
            className="flex items-center gap-2 bg-background-surface border border-background-border rounded px-3 py-2"
          >
            <span className="font-mono text-xs text-accent-primary">{label}</span>
            <span className="text-text-muted text-xs">—</span>
            <span className="text-xs text-text-secondary">{desc}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
