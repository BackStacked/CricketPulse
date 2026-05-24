'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, FileText, CheckCircle } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { Badge } from '@/components/ui/Badge'
import { PRD_GOALS } from '@/lib/constants'
import type { Goal } from '@/lib/constants'

function PriorityBadge({ priority }: { priority: Goal['priority'] }) {
  const v: Record<Goal['priority'], 'danger' | 'warning' | 'primary'> = {
    P0: 'danger',
    P1: 'warning',
    P2: 'primary',
  }
  return <Badge variant={v[priority]}>{priority}</Badge>
}

const FEATURES = [
  {
    title: 'Real-time Event Pipeline',
    description: 'Every ball emits a BallEvent JSON to Redis, which is consumed by FastAPI\'s subscriber coroutine and passed through the full agent pipeline.',
  },
  {
    title: 'ML Win Probability',
    description: 'XGBoost classifier with 12 features runs on every delivery via asyncio.to_thread() — never blocks the event loop. Falls back to 50/50 if model unavailable.',
  },
  {
    title: 'LLM Commentary',
    description: 'Groq llama-3.1-8b-instant generates one sentence per ball, grounded in real match statistics. Falls back to "Great delivery!" on any error.',
  },
  {
    title: 'Autonomous Alerts',
    description: 'Rule engine detects wickets, fifties, centuries, sixes, and end-of-innings. Only calls Groq when a milestone is detected — no wasted tokens.',
  },
  {
    title: 'PostgreSQL Audit Log',
    description: 'Every ball event is persisted asynchronously via asyncio.create_task() — never blocks the WebSocket broadcast. DB failure is swallowed silently.',
  },
]

function FeatureCard({ title, description }: { title: string; description: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-background-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-background-surface hover:bg-background-raised transition-colors duration-150 focus-visible:outline focus-visible:outline-accent-primary"
      >
        <div className="flex items-center gap-2">
          <CheckCircle size={14} className="text-accent-green shrink-0" aria-hidden="true" />
          <span className="text-sm font-medium text-text-primary">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        >
          <ChevronDown size={16} className="text-text-muted" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-4 py-3 text-sm leading-7 text-text-secondary border-t border-background-border">
              {description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function PRDSection() {
  return (
    <section aria-labelledby="prd-title" className="space-y-8">
      <div>
        <SectionLabel icon={FileText}>Product Requirements</SectionLabel>
        <h2 id="prd-title" className="text-2xl font-semibold tracking-tight text-text-primary">
          PRD
        </h2>
      </div>

      {/* Executive Summary */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-text-primary">Executive Summary</h3>
        <p className="text-sm leading-7 text-text-secondary">
          CricketPulse is a real-time multi-agent AI backend for live IPL cricket matches. Every ball
          triggers a parallel pipeline of three independent AI agents — a trained XGBoost classifier,
          a Groq-powered LLM commentary generator, and a rule+LLM hybrid alert system.
        </p>
        <p className="text-sm leading-7 text-text-secondary">
          The system ingests Cricsheet-format JSON files through a standalone emitter, publishes events
          to Redis pub/sub, processes them asynchronously in FastAPI, persists to PostgreSQL, and
          delivers live updates via WebSocket to any connected client.
        </p>
      </div>

      {/* Goals table */}
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-4">Goals</h3>
        <div className="bg-background-surface border border-background-border rounded-lg overflow-hidden">
          <table className="w-full text-sm" aria-label="PRD goals table">
            <thead>
              <tr className="border-b border-background-border">
                <th scope="col" className="text-left px-4 py-3 text-xs font-medium uppercase tracking-widest text-text-muted">Priority</th>
                <th scope="col" className="text-left px-4 py-3 text-xs font-medium uppercase tracking-widest text-text-muted">Goal</th>
                <th scope="col" className="text-left px-4 py-3 text-xs font-medium uppercase tracking-widest text-text-muted hidden md:table-cell">Metric</th>
              </tr>
            </thead>
            <tbody>
              {PRD_GOALS.map((goal) => (
                <tr key={goal.id} className="border-b border-background-border last:border-b-0 hover:bg-background-raised transition-colors duration-100">
                  <td className="px-4 py-3">
                    <PriorityBadge priority={goal.priority} />
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{goal.description}</td>
                  <td className="px-4 py-3 font-mono text-xs text-text-muted hidden md:table-cell">{goal.metric}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature specs */}
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-4">Feature Specifications</h3>
        <div className="flex flex-col gap-2">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} title={f.title} description={f.description} />
          ))}
        </div>
      </div>
    </section>
  )
}
