'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Star, Trophy, Crown } from 'lucide-react'
import type { WebSocketPayload } from '@/types/cricket'

interface MilestoneAnimationProps {
  type: 'fifty' | 'century'
  payload: WebSocketPayload
}

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a)
}

function FiftyOverlay({ batter }: { batter: string }) {
  const icons = useRef(
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: randomBetween(-150, 150),
      y: randomBetween(-200, -50),
      delay: i * 0.08,
    }))
  )

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none border-t-2 border-accent-primary"
      style={{ backgroundColor: 'rgba(30,27,75,0.92)', height: '50%' }}
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%', transition: { duration: 0.3 } }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
    >
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        {icons.current.map((ic) => (
          <motion.div
            key={ic.id}
            className="absolute text-accent-primary/60"
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{ x: ic.x, y: ic.y, opacity: 0 }}
            transition={{ duration: 1.2, delay: ic.delay, ease: 'easeOut' }}
          >
            <Trophy size={20} aria-hidden="true" />
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center h-full gap-2 relative z-10">
        <motion.span
          className="font-mono font-black text-accent-primary select-none"
          style={{ fontSize: 'clamp(4rem, 10vw, 7rem)', lineHeight: 1 }}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          50
        </motion.span>
        <motion.p
          className="text-white text-2xl font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          {batter}
        </motion.p>
        <motion.p
          className="text-xs uppercase tracking-widest text-indigo-300 font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          Half Century!
        </motion.p>
      </div>
    </motion.div>
  )
}

function CenturyOverlay({ batter }: { batter: string }) {
  const icons = useRef(
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: randomBetween(-300, 300),
      y: randomBetween(-300, 300),
      delay: i * 0.05,
      isTrophy: i % 2 === 0,
    }))
  )

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      style={{ backgroundColor: 'rgba(59,7,100,0.9)' }}
    >
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        {icons.current.map((ic) => (
          <motion.div
            key={ic.id}
            className="absolute text-accent-purple/70"
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{ x: ic.x, y: ic.y, opacity: 0 }}
            transition={{ duration: 1.8, delay: ic.delay, ease: 'easeOut' }}
          >
            {ic.isTrophy ? <Trophy size={20} aria-hidden="true" /> : <Star size={16} aria-hidden="true" />}
          </motion.div>
        ))}
      </div>

      {/* Pulse */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at center, rgba(168,85,247,0.15) 0%, transparent 70%)' }}
        animate={{ opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.5, repeat: 0 }}
        aria-hidden="true"
      />

      <div className="flex flex-col items-center gap-4 relative z-10">
        {/* Crown drops from top */}
        <motion.div
          className="text-accent-purple"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 }}
          aria-hidden="true"
        >
          <Crown size={48} />
        </motion.div>

        <motion.h1
          className="font-mono font-black text-accent-purple select-none"
          style={{ fontSize: 'clamp(5rem, 14vw, 10rem)', lineHeight: 1 }}
          initial={{ rotate: -5, opacity: 0, scale: 0.8 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
        >
          100
        </motion.h1>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-white text-3xl font-bold">CENTURY!</p>
          <p className="text-purple-300 text-xl mt-1">{batter}</p>
          <p className="text-purple-400/70 text-sm font-mono uppercase tracking-widest mt-1">
            What a knock!
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function MilestoneAnimation({ type, payload }: MilestoneAnimationProps) {
  const batter = payload.ball.batter
  return type === 'century' ? (
    <CenturyOverlay batter={batter} />
  ) : (
    <FiftyOverlay batter={batter} />
  )
}
