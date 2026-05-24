'use client'

import { useEffect, useReducer } from 'react'
import type { BallEvent, WebSocketPayload } from '@/types/cricket'

interface MatchState {
  runsTotal: number
  wickets: number
  currentRR: number
  requiredRR: number
  ballHistory: BallEvent[]
  commentaryHistory: string[]
  ballNumber: number
}

type Action =
  | { type: 'BALL_EVENT'; payload: WebSocketPayload }
  | { type: 'INNING_RESET' }

const MAX_BALL_HISTORY = 24
const MAX_COMMENTARY = 10

function matchReducer(state: MatchState, action: Action): MatchState {
  if (action.type === 'INNING_RESET') {
    return {
      ...state,
      runsTotal: 0,
      wickets: 0,
      currentRR: 0,
      requiredRR: 0,
      ballNumber: 0,
    }
  }

  if (action.type === 'BALL_EVENT') {
    const { ball, commentary } = action.payload
    const newBallNumber = state.ballNumber + 1
    const newRuns = state.runsTotal + ball.total_runs
    const newWickets = state.wickets + (ball.is_wicket ? 1 : 0)
    const oversElapsed = newBallNumber / 6
    const currentRR = oversElapsed > 0 ? newRuns / oversElapsed : 0
    const ballHistory = [ball, ...state.ballHistory].slice(0, MAX_BALL_HISTORY)
    const commentaryHistory = commentary
      ? [commentary, ...state.commentaryHistory].slice(0, MAX_COMMENTARY)
      : state.commentaryHistory

    return {
      runsTotal: newRuns,
      wickets: newWickets,
      currentRR,
      requiredRR: state.requiredRR,
      ballHistory,
      commentaryHistory,
      ballNumber: newBallNumber,
    }
  }

  return state
}

const initialState: MatchState = {
  runsTotal: 0,
  wickets: 0,
  currentRR: 0,
  requiredRR: 0,
  ballHistory: [],
  commentaryHistory: [],
  ballNumber: 0,
}

export function useMatchState(payload: WebSocketPayload | null): MatchState {
  const [state, dispatch] = useReducer(matchReducer, initialState)

  useEffect(() => {
    if (!payload) return
    dispatch({ type: 'BALL_EVENT', payload })
  }, [payload])

  return state
}
