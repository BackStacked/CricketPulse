'use client'

import Link from 'next/link'
import { FileText } from 'lucide-react'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useMatchState } from '@/hooks/useMatchState'
import { useAnimationTrigger } from '@/hooks/useAnimationTrigger'
import { AnimationManager } from '@/components/animations/AnimationManager'
import { MatchHeader } from '@/components/dashboard/MatchHeader'
import { ScoreBoard } from '@/components/dashboard/ScoreBoard'
import { WinProbBar } from '@/components/dashboard/WinProbBar'
import { BallTimeline } from '@/components/dashboard/BallTimeline'
import { CommentaryFeed } from '@/components/dashboard/CommentaryFeed'
import { AlertBanner } from '@/components/dashboard/AlertBanner'
import { AgentStatus } from '@/components/dashboard/AgentStatus'

export default function DashboardPage() {
  const { payload, connectionStatus } = useWebSocket()
  const matchState = useMatchState(payload)
  const { currentAnimation, animationPayload } = useAnimationTrigger(payload)

  const ball = payload?.ball

  return (
    <>
      <AnimationManager currentAnimation={currentAnimation} payload={animationPayload} />

      <div className="min-h-screen bg-background-base">
        <nav className="border-b border-background-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-text-primary">
              Cricket<span className="text-accent-primary">Pulse</span>
            </span>
            <span className="text-xs text-text-muted font-mono">v1.0</span>
          </div>
          <Link
            href="/docs"
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors duration-150 focus-visible:outline focus-visible:outline-accent-primary rounded px-1"
          >
            <FileText size={14} aria-hidden="true" />
            <span>Docs</span>
          </Link>
        </nav>

        <main className="p-4 lg:grid lg:grid-cols-[60%_40%] lg:gap-4 space-y-4 lg:space-y-0">
          {/* Left column */}
          <div className="flex flex-col gap-4">
            <MatchHeader payload={payload} connectionStatus={connectionStatus} />
            <ScoreBoard
              runsTotal={matchState.runsTotal}
              wickets={matchState.wickets}
              currentRR={matchState.currentRR}
              requiredRR={matchState.requiredRR}
              over={ball?.over ?? 0}
              ball={ball?.ball ?? 0}
              inning={ball?.inning ?? 1}
            />
            <WinProbBar winProb={payload?.win_prob ?? null} />
            <BallTimeline balls={matchState.ballHistory} />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            <AlertBanner alert={payload?.alert ?? null} animationType={currentAnimation} />
            <CommentaryFeed
              commentary={matchState.commentaryHistory}
              currentOver={ball?.over ?? 0}
              currentBall={ball?.ball ?? 0}
            />
            <AgentStatus payload={payload} />
          </div>
        </main>
      </div>
    </>
  )
}
