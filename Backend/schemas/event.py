from pydantic import BaseModel, field_validator


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

    @field_validator("inning")
    @classmethod
    def validate_inning(cls, v: int) -> int:
        if v not in (1, 2):
            raise ValueError("inning must be 1 or 2")
        return v

    @field_validator("over")
    @classmethod
    def validate_over(cls, v: int) -> int:
        if not 0 <= v <= 19:
            raise ValueError("over must be 0–19")
        return v

    @field_validator("ball")
    @classmethod
    def validate_ball(cls, v: int) -> int:
        if not 0 <= v <= 5:
            raise ValueError("ball must be 0–5")
        return v

    @field_validator("batsman_runs")
    @classmethod
    def validate_batsman_runs(cls, v: int) -> int:
        if not 0 <= v <= 6:
            raise ValueError("batsman_runs must be 0–6")
        return v

    @field_validator("extra_runs")
    @classmethod
    def validate_extra_runs(cls, v: int) -> int:
        if not 0 <= v <= 5:
            raise ValueError("extra_runs must be 0–5")
        return v
