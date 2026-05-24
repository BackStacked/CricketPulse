'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { WebSocketPayload } from '@/types/cricket'

interface WicketAnimationProps {
  payload: WebSocketPayload
}

const PARTICLE_COUNT = 12

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a)
}

export function WicketAnimation({ payload }: WicketAnimationProps) {
  const { ball } = payload
  const particles = useRef(
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: randomBetween(-200, 200),
      y: randomBetween(-200, 200),
      delay: Math.random() * 0.3,
    }))
  )

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      style={{ backgroundColor: 'rgba(0,0,0,0.82)' }}
    >
      {/* Red radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(239,68,68,0.15) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Particles */}
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        {particles.current.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-2 h-2 rounded-full bg-accent-red"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
            transition={{ duration: 1, delay: p.delay, ease: 'easeOut' }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 relative z-10">
        {/* WICKET text */}
        <motion.h1
          className="font-mono font-black tracking-tighter text-accent-red select-none"
          style={{ fontSize: 'clamp(5rem, 12vw, 9rem)', lineHeight: 1 }}
          initial={{ scale: 3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, x: [0, -20, 20, -20, 20, 0] }}
          transition={{
            scale: { type: 'spring', stiffness: 200, damping: 20 },
            opacity: { duration: 0.3 },
            x: { delay: 0.5, duration: 0.5 },
          }}
        >
          WICKET
        </motion.h1>

        {/* Dismissal info */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <p className="text-white text-2xl font-semibold">
            {ball.player_dismissed ?? ball.batter}
          </p>
          <p className="text-text-secondary text-sm font-mono uppercase tracking-widest mt-1">
            {ball.dismissal_kind ?? 'dismissed'}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
