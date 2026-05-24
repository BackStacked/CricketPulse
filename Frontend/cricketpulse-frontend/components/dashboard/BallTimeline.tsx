'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { SectionLabel } from '@/components/ui/SectionLabel'
import type { BallEvent } from '@/types/cricket'

interface BallTimelineProps {
  balls: BallEvent[]
}

function chipStyle(ball: BallEvent): string {
  if (ball.is_wicket) return 'bg-red-950 text-red-300 border border-red-800'
  if (ball.batsman_runs === 6) return 'bg-amber-950 text-amber-300 border border-amber-800'
  if (ball.batsman_runs === 4) return 'bg-green-950 text-green-300 border border-green-800'
  if (ball.batsman_runs >= 1) return 'bg-blue-950 text-blue-300 border border-blue-800'
  return 'bg-background-raised text-text-muted border border-background-border'
}

function chipLabel(ball: BallEvent): string {
  if (ball.is_wicket) return 'W'
  if (ball.batsman_runs === 6) return '6'
  if (ball.batsman_runs === 4) return '4'
  if (ball.batsman_runs === 0) return '·'
  return String(ball.batsman_runs)
}

export function BallTimeline({ balls }: BallTimelineProps) {
  return (
    <div className="bg-background-surface border border-background-border rounded-lg p-4">
      <SectionLabel>Ball Timeline</SectionLabel>
      <div
        className="flex flex-wrap gap-1.5"
        role="list"
        aria-label="Recent ball history"
      >
        <AnimatePresence initial={false}>
          {balls.map((ball, i) => (
            <motion.div
              key={`${ball.over}-${ball.ball}-${i}`}
              role="listitem"
              aria-label={`Over ${ball.over}.${ball.ball}: ${chipLabel(ball)} runs`}
              className={[
                'w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold',
                chipStyle(ball),
              ].join(' ')}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {chipLabel(ball)}
            </motion.div>
          ))}
        </AnimatePresence>
        {balls.length === 0 && (
          <span className="text-xs text-text-muted italic">Waiting for match data…</span>
        )}
      </div>
    </div>
  )
}
