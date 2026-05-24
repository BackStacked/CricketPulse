'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import type { WebSocketPayload } from '@/types/cricket'

interface SixAnimationProps {
  payload: WebSocketPayload
}

const STAR_COUNT = 20

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a)
}

export function SixAnimation({ payload }: SixAnimationProps) {
  const { ball } = payload
  const stars = useRef(
    Array.from({ length: STAR_COUNT }, (_, i) => ({
      id: i,
      x: randomBetween(-300, 300),
      y: randomBetween(-300, 300),
      rotate: randomBetween(0, 360),
      delay: i * 0.05,
    }))
  )

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ scale: 0.85, opacity: 0, transition: { duration: 0.3 } }}
      style={{ backgroundColor: 'rgba(69,26,3,0.87)' }}
    >
      {/* Stars scatter */}
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        {stars.current.map((s) => (
          <motion.div
            key={s.id}
            className="absolute text-accent-amber"
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
            animate={{ x: s.x, y: s.y, opacity: 0, rotate: s.rotate, scale: 0.3 }}
            transition={{ duration: 1.5, delay: s.delay, ease: 'easeOut' }}
          >
            <Star size={16} aria-hidden="true" />
          </motion.div>
        ))}
      </div>

      {/* Pulse background */}
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(245,158,11,0.08)' }}
        animate={{ opacity: [0.08, 0.04, 0.08] }}
        transition={{ duration: 1, repeat: 0 }}
        aria-hidden="true"
      />

      <div className="flex flex-col items-center gap-3 relative z-10">
        {/* SIX! */}
        <motion.h1
          className="font-mono font-black text-accent-amber select-none"
          style={{ fontSize: 'clamp(5rem, 14vw, 10rem)', lineHeight: 1 }}
          initial={{ y: -200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          SIX!
        </motion.h1>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.25 }}
        >
          <p className="text-white text-xl font-semibold">{ball.batter}</p>
          <p className="text-amber-300 text-sm font-mono uppercase tracking-widest">
            clears the ropes!
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
