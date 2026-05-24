from fastapi import APIRouter, Query
from sqlalchemy import select, func
from Backend.core.event_processor import process_event, get_cumulative
from Backend.core.ws_manager import manager
from Backend.database import async_session_factory
from Backend.db.models import BallEventLog
from Backend.schemas.event import BallEvent
from Backend.schemas.response import MatchStateResponse, HistoryResponse, HistoryItem

router = APIRouter()


@router.get("/match/state", response_model=MatchStateResponse)
async def match_state():
    cum = get_cumulative()
    ms = cum.get("current_match_state", {})
    if not ms:
        return MatchStateResponse(
            match_id=None, inning=None, batting_team=None, bowling_team=None,
            over=None, ball=None, runs_so_far=None, wickets_so_far=None,
            win_prob=None, last_commentary=None,
        )
    return MatchStateResponse(
        match_id=cum.get("match_id"),
        inning=cum.get("inning"),
        batting_team=ms.get("batting_team"),
        bowling_team=ms.get("bowling_team"),
        over=ms.get("over"),
        ball=ms.get("ball"),
        runs_so_far=cum.get("runs_so_far"),
        wickets_so_far=cum.get("wickets_so_far"),
        win_prob=ms,
        last_commentary=None,
    )


@router.get("/match/history", response_model=HistoryResponse)
async def match_history(limit: int = Query(default=20, ge=1, le=100)):
    async with async_session_factory() as session:
        result = await session.execute(
            select(BallEventLog)
            .order_by(BallEventLog.timestamp.desc())
            .limit(limit)
        )
        rows = result.scalars().all()

        count_result = await session.execute(select(func.count(BallEventLog.id)))
        total = count_result.scalar()

    items = [
        HistoryItem(
            over=row.over,
            ball=row.ball,
            batting_team=row.batting_team,
            total_runs=row.total_runs,
            is_wicket=row.is_wicket,
            win_prob_batting=row.win_prob_batting,
            commentary=row.commentary,
            timestamp=row.timestamp.isoformat(),
        )
        for row in rows
    ]
    return HistoryResponse(items=items, total=total or 0)


@router.post("/match/event")
async def inject_event(event: BallEvent):
    await process_event(event.model_dump(), manager)
    return {"status": "ok", "event": event.model_dump()}


_DEMO_WICKET = {
    "match_id": "demo",
    "inning": 1,
    "batting_team": "Mumbai Indians",
    "bowling_team": "Kolkata Knight Riders",
    "over": 14,
    "ball": 3,
    "batter": "Rohit Sharma",
    "bowler": "Jasprit Bumrah",
    "non_striker": "Ishan Kishan",
    "batsman_runs": 0,
    "extra_runs": 0,
    "total_runs": 0,
    "is_wicket": True,
    "player_dismissed": "Rohit Sharma",
    "dismissal_kind": "caught",
    "is_powerplay": False,
}


@router.post("/demo/wicket")
async def demo_wicket():
    await process_event(_DEMO_WICKET, manager)
    return {"status": "ok", "event": _DEMO_WICKET}
