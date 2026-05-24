from pydantic import BaseModel


class BallEvent(BaseModel):
    match_id: str
    inning: int
    batting_team: str
    bowling_team: str
    over: int
    ball: int
    batter: str
    bowler: str
    non_striker: str
    batsman_runs: int
    extra_runs: int
    total_runs: int
    is_wicket: bool
    player_dismissed: str | None = None
    dismissal_kind: str | None = None
    is_powerplay: bool = False
