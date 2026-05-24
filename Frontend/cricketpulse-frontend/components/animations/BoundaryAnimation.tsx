'use client'

import { motion } from 'framer-motion'
import type { WebSocketPayload } from '@/types/cricket'

interface BoundaryAnimationProps {
  payload: WebSocketPayload
}

export function BoundaryAnimation({ payload }: BoundaryAnimationProps) {
  const { ball } = payload

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none border-t border-green-800"
      style={{ backgroundColor: 'rgba(5,46,22,0.92)', height: '33.33%' }}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%', transition: { duration: 0.3, ease: 'easeIn' } }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Sweep line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-0.5 bg-green-400 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        aria-hidden="true"
      />

      <div className="flex items-center justify-between h-full px-8 md:px-16">
        {/* FOUR */}
        <motion.span
          className="font-mono font-black text-green-400 select-none"
          style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', lineHeight: 1 }}
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        >
          FOUR
        </motion.span>

        {/* Batter info */}
        <motion.div
          className="text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.25 }}
        >
          <p className="text-green-300 text-lg font-semibold">{ball.batter}</p>
          <p className="text-green-500 text-sm font-mono">drives for FOUR</p>
        </motion.div>
      </div>
    </motion.div>
  )
}
