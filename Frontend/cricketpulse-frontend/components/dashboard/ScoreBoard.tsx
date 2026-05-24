'use client'

import { TrendingUp, Clock, Activity, Target } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { NumberFlash } from '@/components/ui/NumberFlash'

interface ScoreBoardProps {
  runsTotal: number
  wickets: number
  currentRR: number
  requiredRR: number
  over: number
  ball: number
  inning: number
}

export function ScoreBoard({ runsTotal, wickets, currentRR, requiredRR, over, ball, inning }: ScoreBoardProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Score */}
      <div className="bg-background-surface border border-background-border rounded-lg p-4 border-l-2 border-l-accent-primary">
        <SectionLabel icon={Activity}>Score</SectionLabel>
        <div className="font-mono text-3xl font-bold text-text-primary tabular-nums">
          <NumberFlash value={`${runsTotal} / ${wickets}`} />
        </div>
      </div>

      {/* Over */}
      <div className="bg-background-surface border border-background-border rounded-lg p-4">
        <SectionLabel icon={Clock}>Over</SectionLabel>
        <div className="font-mono text-3xl font-bold text-text-primary tabular-nums">
          <NumberFlash value={`${over}.${ball}`} />
        </div>
      </div>

      {/* Run Rate */}
      <div className="bg-background-surface border border-background-border rounded-lg p-4">
        <SectionLabel icon={TrendingUp}>Run Rate</SectionLabel>
        <div className="font-mono text-2xl font-bold text-text-primary tabular-nums">
          <NumberFlash value={currentRR.toFixed(1)} />
        </div>
      </div>

      {/* Required RR */}
      <div className="bg-background-surface border border-background-border rounded-lg p-4">
        <SectionLabel icon={Target}>Required RR</SectionLabel>
        <div className="font-mono text-2xl font-bold tabular-nums">
          {inning === 2 ? (
            <NumberFlash
              value={requiredRR.toFixed(1)}
              className={requiredRR > currentRR ? 'text-accent-red' : 'text-accent-green'}
            />
          ) : (
            <span className="text-text-muted">—</span>
          )}
        </div>
      </div>
    </div>
  )
}
