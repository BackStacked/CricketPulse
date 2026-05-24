'use client'

import { SectionLabel } from '@/components/ui/SectionLabel'
import type { WinProbResult } from '@/types/cricket'

interface WinProbBarProps {
  winProb: WinProbResult | null
}

export function WinProbBar({ winProb }: WinProbBarProps) {
  const battingProb = winProb?.batting_prob ?? 50
  const bowlingProb = winProb?.bowling_prob ?? 50
  const battingTeam = winProb?.batting_team ?? 'Batting'
  const bowlingTeam = winProb?.bowling_team ?? 'Bowling'

  return (
    <div className="bg-background-surface border border-background-border rounded-lg p-4">
      {/* Values row */}
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-mono text-lg font-bold text-accent-primary tabular-nums">
          {battingProb.toFixed(1)}%
        </span>
        <span className="font-mono text-lg font-bold text-accent-secondary tabular-nums">
          {bowlingProb.toFixed(1)}%
        </span>
      </div>

      {/* Team names */}
      <div className="flex justify-between mb-2">
        <span className="text-xs text-text-muted truncate max-w-[45%]">{battingTeam}</span>
        <span className="text-xs text-text-muted truncate max-w-[45%] text-right">{bowlingTeam}</span>
      </div>

      {/* Bar — CSS transition, no border-radius (sharp edges per spec) */}
      <div
        className="flex h-10 overflow-hidden"
        role="meter"
        aria-label={`Win probability: ${battingTeam} ${battingProb.toFixed(1)}%, ${bowlingTeam} ${bowlingProb.toFixed(1)}%`}
        aria-valuenow={battingProb}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${battingProb}%`,
            background: 'linear-gradient(90deg, #6366F1, #818CF8)',
          }}
        />
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${bowlingProb}%`,
            background: 'linear-gradient(90deg, #0d9488, #14B8A6)',
          }}
        />
      </div>

      <div className="mt-2">
        <SectionLabel>Win Probability</SectionLabel>
      </div>
    </div>
  )
}
