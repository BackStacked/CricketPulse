from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class BallEventLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    match_id: str
    inning: int
    over: int
    ball: int
    batting_team: str
    bowling_team: str
    batter: str
    bowler: str
    total_runs: int
    is_wicket: bool
    player_dismissed: Optional[str] = None
    win_prob_batting: float
    win_prob_bowling: float
    commentary: Optional[str] = None
    alert: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class LLMResponseLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    agent_name: str
    prompt_summary: str
    response: str
    latency_ms: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)
