from pydantic import BaseModel
from Backend.schemas.event import BallEvent


class WinProbResult(BaseModel):
    batting_team: str
    bowling_team: str
    batting_prob: float
    bowling_prob: float


class WebSocketPayload(BaseModel):
    ball: BallEvent
    win_prob: WinProbResult
    commentary: str
    alert: str | None
    timestamp: str
