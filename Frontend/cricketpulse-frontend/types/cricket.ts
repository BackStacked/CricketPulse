export interface BallEvent {
  match_id: string
  inning: number
  batting_team: string
  bowling_team: string
  over: number
  ball: number
  batter: string
  bowler: string
  non_striker: string
  batsman_runs: number
  extra_runs: number
  total_runs: number
  is_wicket: boolean
  player_dismissed: string | null
  dismissal_kind: string | null
  is_powerplay: boolean
}

export interface WinProbResult {
  batting_team: string
  bowling_team: string
  batting_prob: number
  bowling_prob: number
}

export interface WebSocketPayload {
  ball: BallEvent
  win_prob: WinProbResult
  commentary: string
  alert: string | null
  timestamp: string
}

export type AnimationEvent = 'wicket' | 'four' | 'six' | 'fifty' | 'century' | null

export interface MatchDisplayState {
  currentPayload: WebSocketPayload | null
  runsTotal: number
  wickets: number
  currentRR: number
  requiredRR: number
  ballHistory: BallEvent[]
  commentaryHistory: string[]
  connectionStatus: 'connecting' | 'live' | 'disconnected'
  currentAnimation: AnimationEvent
}
