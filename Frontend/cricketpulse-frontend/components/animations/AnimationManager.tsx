'use client'

import { AnimatePresence } from 'framer-motion'
import type { AnimationEvent, WebSocketPayload } from '@/types/cricket'
import { WicketAnimation } from './WicketAnimation'
import { BoundaryAnimation } from './BoundaryAnimation'
import { SixAnimation } from './SixAnimation'
import { MilestoneAnimation } from './MilestoneAnimation'

interface AnimationManagerProps {
  currentAnimation: AnimationEvent
  payload: WebSocketPayload | null
}

export function AnimationManager({ currentAnimation, payload }: AnimationManagerProps) {
  return (
    <AnimatePresence mode="wait">
      {currentAnimation === 'wicket' && payload && (
        <WicketAnimation key="wicket" payload={payload} />
      )}
      {currentAnimation === 'six' && payload && (
        <SixAnimation key="six" payload={payload} />
      )}
      {currentAnimation === 'four' && payload && (
        <BoundaryAnimation key="four" payload={payload} />
      )}
      {currentAnimation === 'fifty' && payload && (
        <MilestoneAnimation key="fifty" type="fifty" payload={payload} />
      )}
      {currentAnimation === 'century' && payload && (
        <MilestoneAnimation key="century" type="century" payload={payload} />
      )}
    </AnimatePresence>
  )
}
