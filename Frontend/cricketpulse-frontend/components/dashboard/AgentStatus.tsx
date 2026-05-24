'use client'

import { motion } from 'framer-motion'
import { Brain, MessageSquare, Bell, Activity } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import type { WebSocketPayload } from '@/types/cricket'

interface AgentStatusProps {
  payload: WebSocketPayload | null
}

export function AgentStatus({ payload }: AgentStatusProps) {
  const winProb = payload?.win_prob
  const hasCommentary = Boolean(payload?.commentary)
  const hasAlert = Boolean(payload?.alert)

  const agents = [
    {
      icon: Brain,
      label: 'Win Probability',
      value: winProb
        ? `${winProb.batting_team.split(' ').pop()} ${winProb.batting_prob.toFixed(1)}%`
        : '—',
      fired: Boolean(winProb),
      valueClass: 'text-accent-primary font-mono tabular-nums',
    },
    {
      icon: MessageSquare,
      label: 'Commentary',
      value: hasCommentary ? 'Fired' : '—',
      fired: hasCommentary,
      valueClass: hasCommentary ? 'text-accent-green' : 'text-text-muted',
    },
    {
      icon: Bell,
      label: 'Alert Agent',
      value: hasAlert ? 'Triggered' : 'Silent',
      fired: hasAlert,
      valueClass: hasAlert ? 'text-accent-red' : 'text-text-muted',
    },
  ]

  return (
    <div className="bg-background-surface border border-background-border rounded-lg p-4">
      <SectionLabel icon={Activity}>Agent Activity</SectionLabel>
      <div className="flex flex-col">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.label}
            className="flex items-center justify-between py-2 border-b border-background-border last:border-b-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1, duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <agent.icon size={14} className="text-text-muted" aria-hidden="true" />
              <span className="text-xs text-text-secondary">{agent.label}</span>
            </div>
            <span className={`text-xs font-medium ${agent.valueClass}`}>
              {agent.value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
