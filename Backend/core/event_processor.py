import asyncio
from datetime import datetime

from Backend.agents.win_probability import build_match_state, predict_win_probability
from Backend.agents.commentary import generate_commentary
from Backend.agents.alerts import check_and_alert
from Backend.schemas.event import BallEvent
from Backend.schemas.payload import WinProbResult, WebSocketPayload

_cumulative = {
    "match_id": None,
    "inning": 1,
    "runs_so_far": 0,
    "wickets_so_far": 0,
    "ball_number": 0,
    "target": 0,
    "innings1_total": 0,
    "batter_runs": {},
    "current_match_state": {},
}


async def process_event(event: dict, ws_manager):
    global _cumulative

    prev_inning = _cumulative["inning"]

    # Innings transition: first ball of inning 2 detected
    if event["inning"] == 2 and _cumulative["innings1_total"] == 0 and prev_inning == 1:
        innings1_total = _cumulative["runs_so_far"]
        _cumulative["innings1_total"] = innings1_total
        _cumulative["runs_so_far"] = event["total_runs"]
        _cumulative["wickets_so_far"] = 1 if event["is_wicket"] else 0
        _cumulative["ball_number"] = 1
        _cumulative["target"] = innings1_total + 1
        _cumulative["batter_runs"] = {event["batter"]: event["batsman_runs"]}
    else:
        # Normal cumulative update
        _cumulative["match_id"] = event["match_id"]
        _cumulative["inning"] = event["inning"]
        _cumulative["runs_so_far"] += event["total_runs"]
        if event["is_wicket"]:
            _cumulative["wickets_so_far"] += 1
        _cumulative["ball_number"] += 1
        batter = event["batter"]
        _cumulative["batter_runs"][batter] = (
            _cumulative["batter_runs"].get(batter, 0) + event["batsman_runs"]
        )

    _cumulative["match_id"] = event["match_id"]
    _cumulative["inning"] = event["inning"]

    match_state = build_match_state(event, _cumulative)
    _cumulative["current_match_state"] = match_state

    win_prob_result, alert = await asyncio.gather(
        asyncio.to_thread(predict_win_probability, match_state),
        check_and_alert(event, _cumulative),
    )

    commentary = await generate_commentary(event, win_prob_result)

    payload = WebSocketPayload(
        ball=BallEvent(**event),
        win_prob=WinProbResult(**win_prob_result),
        commentary=commentary,
        alert=alert,
        timestamp=datetime.utcnow().isoformat() + "Z",
    )
    await ws_manager.broadcast(payload.model_dump())

    asyncio.create_task(log_to_db(event, win_prob_result, commentary, alert))

    print(
        f"[{event['inning']}.{event['over']}.{event['ball']}] "
        f"{event['batter']} | {event['total_runs']} runs | "
        f"WinProb: {win_prob_result['batting_team']} {win_prob_result['batting_prob']}% | "
        f"Wicket: {event['is_wicket']}"
    )


async def log_to_db(event: dict, win_prob: dict, commentary: str, alert: str | None):
    try:
        from Backend.database import async_session_factory
        from Backend.db.models import BallEventLog

        record = BallEventLog(
            match_id=event["match_id"],
            inning=event["inning"],
            over=event["over"],
            ball=event["ball"],
            batting_team=event["batting_team"],
            bowling_team=event["bowling_team"],
            batter=event["batter"],
            bowler=event["bowler"],
            total_runs=event["total_runs"],
            is_wicket=event["is_wicket"],
            player_dismissed=event.get("player_dismissed"),
            win_prob_batting=win_prob["batting_prob"],
            win_prob_bowling=win_prob["bowling_prob"],
            commentary=commentary,
            alert=alert,
        )
        async with async_session_factory() as session:
            session.add(record)
            await session.commit()
    except Exception:
        pass


def get_cumulative() -> dict:
    return _cumulative


def reset_cumulative():
    global _cumulative
    _cumulative = {
        "match_id": None,
        "inning": 1,
        "runs_so_far": 0,
        "wickets_so_far": 0,
        "ball_number": 0,
        "target": 0,
        "innings1_total": 0,
        "batter_runs": {},
        "current_match_state": {},
    }
