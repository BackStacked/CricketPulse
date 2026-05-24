'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'

interface CommentaryFeedProps {
  commentary: string[]
  currentOver: number
  currentBall: number
}

export function CommentaryFeed({ commentary, currentOver, currentBall }: CommentaryFeedProps) {
  return (
    <div className="bg-background-surface border border-background-border rounded-lg p-4 flex flex-col gap-3">
      <SectionLabel icon={MessageSquare}>Live Commentary</SectionLabel>

      <ol
        className="flex flex-col gap-2 overflow-hidden"
        aria-live="polite"
        aria-label="Live commentary feed"
      >
        <AnimatePresence initial={false}>
          {commentary.map((text, i) => (
            <motion.li
              key={text}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1 - i * 0.09, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex gap-3 items-start min-w-0"
            >
              <span className="shrink-0 font-mono text-xs bg-background-raised border border-background-border px-1.5 py-0.5 rounded text-text-muted tabular-nums">
                {i === 0 ? `${currentOver}.${currentBall}` : '•••'}
              </span>
              <span className="text-sm font-normal leading-relaxed text-text-secondary min-w-0">
                {text}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
        {commentary.length === 0 && (
          <li className="text-xs text-text-muted italic">
            Waiting for commentary…
          </li>
        )}
      </ol>
    </div>
  )
}
