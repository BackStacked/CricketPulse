'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Zap, Star } from 'lucide-react'
import type { AnimationEvent } from '@/types/cricket'

interface AlertBannerProps {
  alert: string | null
  animationType: AnimationEvent
}

function alertStyle(type: AnimationEvent): string {
  if (type === 'wicket') return 'bg-red-950 border-red-800 text-red-200'
  if (type === 'six') return 'bg-amber-950 border-amber-800 text-amber-200'
  return 'bg-indigo-950 border-indigo-800 text-indigo-200'
}

function AlertIcon({ type }: { type: AnimationEvent }) {
  if (type === 'wicket') return <AlertTriangle size={16} aria-hidden="true" className="text-red-400 shrink-0" />
  if (type === 'six') return <Zap size={16} aria-hidden="true" className="text-amber-400 shrink-0" />
  return <Star size={16} aria-hidden="true" className="text-indigo-400 shrink-0" />
}

export function AlertBanner({ alert, animationType }: AlertBannerProps) {
  const [visible, setVisible] = useState(false)
  const [displayAlert, setDisplayAlert] = useState<string | null>(null)
  const [displayType, setDisplayType] = useState<AnimationEvent>(null)

  useEffect(() => {
    if (!alert) return
    setDisplayAlert(alert)
    setDisplayType(animationType)
    setVisible(true)
    const timer = setTimeout(() => setVisible(false), 4000)
    return () => clearTimeout(timer)
  }, [alert, animationType])

  return (
    <AnimatePresence>
      {visible && displayAlert && (
        <motion.div
          role="alert"
          aria-live="assertive"
          className={[
            'border rounded-lg px-4 py-3 flex items-center gap-3',
            alertStyle(displayType),
          ].join(' ')}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <AlertIcon type={displayType} />
          <p className="text-sm font-medium leading-snug">{displayAlert}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
