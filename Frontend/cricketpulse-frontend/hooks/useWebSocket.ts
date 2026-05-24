'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { WebSocketPayload } from '@/types/cricket'

type ConnectionStatus = 'connecting' | 'live' | 'disconnected'

interface UseWebSocketReturn {
  payload: WebSocketPayload | null
  connectionStatus: ConnectionStatus
}

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8000/ws'
const BASE_RETRY_DELAY = 3000
const MAX_RETRY_DELAY = 30000

export function useWebSocket(): UseWebSocketReturn {
  const [payload, setPayload] = useState<WebSocketPayload | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting')

  const socketRef = useRef<WebSocket | null>(null)
  const retryDelayRef = useRef(BASE_RETRY_DELAY)
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(true)

  const connect = useCallback(() => {
    if (!mountedRef.current) return

    setConnectionStatus('connecting')

    const ws = new WebSocket(WS_URL)
    socketRef.current = ws

    ws.onopen = () => {
      if (!mountedRef.current) return
      setConnectionStatus('live')
      retryDelayRef.current = BASE_RETRY_DELAY
    }

    ws.onmessage = (event: MessageEvent) => {
      if (!mountedRef.current) return
      try {
        const data = JSON.parse(event.data as string) as WebSocketPayload
        setPayload(data)
      } catch {
        // Malformed message — ignore
      }
    }

    ws.onclose = () => {
      if (!mountedRef.current) return
      setConnectionStatus('disconnected')
      const delay = retryDelayRef.current
      retryDelayRef.current = Math.min(delay * 1.5, MAX_RETRY_DELAY)
      retryTimeoutRef.current = setTimeout(connect, delay)
    }

    ws.onerror = () => {
      ws.close()
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    connect()

    return () => {
      mountedRef.current = false
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
      if (socketRef.current) {
        socketRef.current.onclose = null
        socketRef.current.close()
      }
    }
  }, [connect])

  return { payload, connectionStatus }
}
