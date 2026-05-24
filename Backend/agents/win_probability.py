from pathlib import Path
import joblib
import numpy as np

_model = None
_encoder = None

_MODELS_DIR = Path(__file__).parent.parent.parent / "models"


def load_model():
    global _model, _encoder
    _model = joblib.load(_MODELS_DIR / "win_prob.pkl")
    _encoder = joblib.load(_MODELS_DIR / "team_encoder.pkl")
    print("[WinProbAgent] Loaded — 81.7% acc, 0.91 AUC")


def build_match_state(event: dict, cumulative: dict) -> dict:
    runs_so_far = cumulative["runs_so_far"]
    ball_number = cumulative["ball_number"]
    inning = event["inning"]
    target = cumulative["target"]

    balls_remaining = max(120 - ball_number, 0)
    overs_elapsed = ball_number / 6.0

    if overs_elapsed > 0:
        current_rr = min(runs_so_far / overs_elapsed, 36.0)
    else:
        current_rr = 0.0

    if inning == 2 and balls_remaining > 0:
        runs_remaining = max(target - runs_so_far, 0)
        required_rr = min(runs_remaining / (balls_remaining / 6.0), 36.0)
    else:
        runs_remaining = 0
        required_rr = 0.0

    return {
        "inning": inning,
        "over": event["over"],
        "ball": event["ball"],
        "runs_so_far": runs_so_far,
        "wickets_so_far": cumulative["wickets_so_far"],
        "balls_remaining": balls_remaining,
        "current_rr": current_rr,
        "required_rr": required_rr,
        "runs_remaining": runs_remaining,
        "target": target,
        "batting_team": event["batting_team"],
        "bowling_team": event["bowling_team"],
    }


def predict_win_probability(match_state: dict) -> dict:
    batting_team = match_state["batting_team"]
    bowling_team = match_state["bowling_team"]

    if _model is None:
        return {
            "batting_team": batting_team,
            "bowling_team": bowling_team,
            "batting_prob": 50.0,
            "bowling_prob": 50.0,
        }

    try:
        batting_enc = _encoder.transform([batting_team])[0]
    except (ValueError, Exception):
        batting_enc = 0

    try:
        bowling_enc = _encoder.transform([bowling_team])[0]
    except (ValueError, Exception):
        bowling_enc = 0

    features = [
        match_state["inning"],
        match_state["over"],
        match_state["ball"],
        match_state["runs_so_far"],
        match_state["wickets_so_far"],
        match_state["balls_remaining"],
        match_state["current_rr"],
        match_state["required_rr"],
        match_state["runs_remaining"],
        match_state["target"],
        batting_enc,
        bowling_enc,
    ]

    prob = _model.predict_proba([features])[0][1]

    return {
        "batting_team": batting_team,
        "bowling_team": bowling_team,
        "batting_prob": round(float(prob) * 100, 1),
        "bowling_prob": round(float(1 - prob) * 100, 1),
    }
