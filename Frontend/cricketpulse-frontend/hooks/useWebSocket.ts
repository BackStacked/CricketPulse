'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { WebSocketPayload } from '@/types/cricket'

type ConnectionStatus = 'connecting' | 'live' | 'disconnected'

interface UseWebSocketReturn {
  payload: WebSocketPayload | null
  connectionStatus: ConnectionStatus
}

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8000/ws'

const BASE_RETRY_DELAY = 3000
const MAX_RETRY_DELAY = 30000

function isValidPayload(data: unknown): data is WebSocketPayload {
  if (typeof data !== 'object' || data === null) {
    return false
  }

  const payload = data as Record<string, unknown>

  return (
    'ball' in payload &&
    'commentary' in payload &&
    'win_prob' in payload
  )
}

export function useWebSocket(): UseWebSocketReturn {
  const [payload, setPayload] = useState<WebSocketPayload | null>(null)

  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('connecting')

  const socketRef = useRef<WebSocket | null>(null)

  const retryDelayRef = useRef(BASE_RETRY_DELAY)

  const retryTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null)

  const mountedRef = useRef(false)

  const cleanup = () => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }

    if (socketRef.current) {
      socketRef.current.onopen = null
      socketRef.current.onmessage = null
      socketRef.current.onerror = null
      socketRef.current.onclose = null

      socketRef.current.close()
      socketRef.current = null
    }
  }

  const connect = useCallback(() => {
    if (!mountedRef.current) return

    cleanup()

    setConnectionStatus('connecting')

    const ws = new WebSocket(WS_URL)

    socketRef.current = ws

    ws.onopen = () => {
      if (!mountedRef.current) return

      console.info('[WebSocket] Connected')

      setConnectionStatus('live')

      retryDelayRef.current = BASE_RETRY_DELAY
    }

    ws.onmessage = (event: MessageEvent) => {
      if (!mountedRef.current) return

      try {
        const parsedData: unknown = JSON.parse(
          event.data as string
        )

        if (!isValidPayload(parsedData)) {
          console.warn(
            '[WebSocket] Invalid payload structure:',
            parsedData
          )

          return
        }

        setPayload(parsedData)
      } catch (error) {
        console.error(
          '[WebSocket] Failed to parse message:',
          error
        )
      }
    }

    ws.onerror = (error) => {
      console.error('[WebSocket] Connection error:', error)

      ws.close()
    }

    ws.onclose = () => {
      if (!mountedRef.current) return

      console.warn('[WebSocket] Disconnected')

      setConnectionStatus('disconnected')

      const delay = retryDelayRef.current

      retryDelayRef.current = Math.min(
        Math.floor(delay * 1.5),
        MAX_RETRY_DELAY
      )

      retryTimeoutRef.current = setTimeout(() => {
        connect()
      }, delay)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true

    connect()

    return () => {
      mountedRef.current = false

      cleanup()
    }
  }, [connect])

  return {
    payload,
    connectionStatus,
  }
}