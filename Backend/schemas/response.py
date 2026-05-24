from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    redis: bool
    db: bool
    model_loaded: bool


class MatchStateResponse(BaseModel):
    match_id: str | None
    inning: int | None
    batting_team: str | None
    bowling_team: str | None
    over: int | None
    ball: int | None
    runs_so_far: int | None
    wickets_so_far: int | None
    win_prob: dict | None
    last_commentary: str | None


class HistoryItem(BaseModel):
    over: int
    ball: int
    batting_team: str
    total_runs: int
    is_wicket: bool
    win_prob_batting: float
    commentary: str | None
    timestamp: str


class HistoryResponse(BaseModel):
    items: list[HistoryItem]
    total: int
