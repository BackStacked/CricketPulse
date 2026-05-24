'use client'

import { Users, Target, Zap } from 'lucide-react'
import { LiveDot } from '@/components/ui/LiveDot'
import { Badge } from '@/components/ui/Badge'
import { formatOver } from '@/lib/utils'
import type { WebSocketPayload } from '@/types/cricket'

interface MatchHeaderProps {
  payload: WebSocketPayload | null
  connectionStatus: 'connecting' | 'live' | 'disconnected'
}

export function MatchHeader({ payload, connectionStatus }: MatchHeaderProps) {
  const ball = payload?.ball

  return (
    <div className="bg-background-surface border border-background-border rounded-lg p-4">
      <div className="flex items-start justify-between gap-4">
        {/* Teams */}
        <div className="flex items-center gap-3 min-w-0">
          <Users size={16} className="text-text-muted shrink-0" aria-hidden="true" />
          <div className="flex items-center gap-2 min-w-0 flex-wrap">
            <span className="text-2xl font-semibold tracking-tight text-accent-primary truncate">
              {ball?.batting_team ?? '—'}
            </span>
            <span className="text-xs text-text-muted font-medium">vs</span>
            <span className="text-2xl font-semibold tracking-tight text-accent-secondary truncate">
              {ball?.bowling_team ?? '—'}
            </span>
            {ball?.is_powerplay && (
              <Badge variant="warning">Powerplay</Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Over */}
          {ball && (
            <div className="flex items-center gap-1.5">
              <Target size={14} className="text-text-muted" aria-hidden="true" />
              <span className="font-mono text-sm text-text-secondary tabular-nums">
                Over {formatOver(ball.over, ball.ball)}
              </span>
            </div>
          )}
          <LiveDot status={connectionStatus} />
        </div>
      </div>

      {/* Batter / Bowler line */}
      {ball && (
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-background-border">
          <div className="flex items-center gap-1.5">
            <Zap size={12} className="text-accent-amber" aria-hidden="true" />
            <span className="text-xs text-text-secondary">
              <span className="text-text-muted">Batter </span>
              <span className="font-medium text-text-primary">{ball.batter}</span>
            </span>
          </div>
          <div className="w-px h-3 bg-background-border" aria-hidden="true" />
          <span className="text-xs text-text-secondary">
            <span className="text-text-muted">Bowler </span>
            <span className="font-medium text-text-primary">{ball.bowler}</span>
          </span>
          <div className="w-px h-3 bg-background-border" aria-hidden="true" />
          <span className="text-xs text-text-muted">
            Inning {ball.inning}
          </span>
        </div>
      )}
    </div>
  )
}
