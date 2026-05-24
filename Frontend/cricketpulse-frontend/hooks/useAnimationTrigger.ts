'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { AnimationEvent, WebSocketPayload } from '@/types/cricket'
import { getAnimationDuration } from '@/lib/utils'

interface UseAnimationTriggerReturn {
  currentAnimation: AnimationEvent
  animationPayload: WebSocketPayload | null
  clearAnimation: () => void
}

export function useAnimationTrigger(payload: WebSocketPayload | null): UseAnimationTriggerReturn {
  const [currentAnimation, setCurrentAnimation] = useState<AnimationEvent>(null)
  const [animationPayload, setAnimationPayload] = useState<WebSocketPayload | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const batterRunsRef = useRef<Map<string, number>>(new Map())
  const lastPayloadRef = useRef<WebSocketPayload | null>(null)

  const clearAnimation = useCallback(() => {
    setCurrentAnimation(null)
  }, [])

  useEffect(() => {
    if (!payload) return
    if (payload === lastPayloadRef.current) return
    lastPayloadRef.current = payload

    const { ball } = payload
    const batter = ball.batter

    // Update cumulative batter runs
    const prev = batterRunsRef.current.get(batter) ?? 0
    const next = prev + ball.batsman_runs
    batterRunsRef.current.set(batter, next)

    let event: AnimationEvent = null

    if (ball.is_wicket) {
      event = 'wicket'
    } else if (ball.batsman_runs === 6) {
      event = 'six'
    } else if (ball.batsman_runs === 4) {
      event = 'four'
    } else if (prev < 100 && next >= 100) {
      event = 'century'
    } else if (prev < 50 && next >= 50) {
      event = 'fifty'
    }

    if (event) {
      if (timerRef.current) clearTimeout(timerRef.current)
      setCurrentAnimation(event)
      setAnimationPayload(payload)
      const duration = getAnimationDuration(event)
      timerRef.current = setTimeout(() => {
        setCurrentAnimation(null)
      }, duration)
    }
  }, [payload])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return { currentAnimation, animationPayload, clearAnimation }
}
