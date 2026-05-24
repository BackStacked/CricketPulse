'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface NumberFlashProps {
  value: string
  className?: string
}

export function NumberFlash({ value, className = '' }: NumberFlashProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className={className}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  )
}
