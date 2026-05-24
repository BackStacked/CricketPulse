# agents/win_probability.py
import joblib
import numpy as np
from pathlib import Path

MODEL_PATH   = Path(__file__).parent.parent.parent / "models" / "win_prob.pkl"
ENCODER_PATH = Path(__file__).parent.parent.parent / "models" / "team_encoder.pkl"

_model   = None
_encoder = None

def load_model():
    """Call once at FastAPI startup via lifespan."""
    global _model, _encoder
    _model   = joblib.load(MODEL_PATH)
    _encoder = joblib.load(ENCODER_PATH)
    print(f"[WinProbAgent] Model loaded — Accuracy 81.7% | ROC-AUC 0.91")


def predict_win_probability(match_state: dict) -> dict:
    """
    Returns win probability for both teams.

    match_state keys:
        inning, over, ball, runs_so_far, wickets_so_far,
        balls_remaining, current_rr, required_rr,
        runs_remaining, target, batting_team, bowling_team

    Returns:
        {
            "batting_team": "Mumbai Indians",
            "bowling_team": "Kolkata Knight Riders",
            "batting_prob": 67.3,
            "bowling_prob": 32.7
        }
    """
    if _model is None:
        return {
            "batting_team": match_state.get("batting_team", ""),
            "bowling_team": match_state.get("bowling_team", ""),
            "batting_prob": 50.0,
            "bowling_prob": 50.0,
        }

    try:
        batting_enc = _encoder.transform([match_state["batting_team"]])[0]
        bowling_enc = _encoder.transform([match_state["bowling_team"]])[0]
    except (ValueError, KeyError):
        batting_enc = 0
        bowling_enc = 0

    features = [
        match_state.get("inning", 1),
        match_state.get("over", 0),
        match_state.get("ball", 0),
        match_state.get("runs_so_far", 0),
        match_state.get("wickets_so_far", 0),
        match_state.get("balls_remaining", 120),
        match_state.get("current_rr", 0.0),
        match_state.get("required_rr", 0.0),
        match_state.get("runs_remaining", 0),
        match_state.get("target", 0),
        batting_enc,
        bowling_enc,
    ]

    batting_prob = round(float(_model.predict_proba([features])[0][1]) * 100, 1)
    bowling_prob = round(100.0 - batting_prob, 1)

    return {
        "batting_team": match_state.get("batting_team", ""),
        "bowling_team": match_state.get("bowling_team", ""),
        "batting_prob": batting_prob,
        "bowling_prob": bowling_prob,
    }


def build_match_state(event: dict, cumulative: dict) -> dict:
    """
    Helper to build match_state from a raw ball event + running cumulative totals.
    Call this in your Redis subscriber before calling predict_win_probability().

    event keys (from emitter):
        match_id, inning, batting_team, bowling_team,
        over, ball, batter, bowler, batsman_runs,
        extra_runs, total_runs, is_wicket

    cumulative keys (maintained by subscriber):
        runs_so_far, wickets_so_far, ball_number,
        target (set after 1st innings ends)
    """
    inning        = event.get("inning", 1)
    runs_so_far   = cumulative.get("runs_so_far", 0)
    ball_number   = cumulative.get("ball_number", 1)
    target        = cumulative.get("target", 0)

    balls_remaining = max(120 - ball_number, 0)
    overs_elapsed   = ball_number / 6.0
    current_rr      = round(runs_so_far / overs_elapsed, 2) if overs_elapsed > 0 else 0.0
    current_rr      = min(current_rr, 36.0)

    runs_remaining = max(target - runs_so_far, 0) if inning == 2 else 0
    required_rr    = 0.0
    if inning == 2 and balls_remaining > 0:
        required_rr = round((runs_remaining / (balls_remaining / 6.0)), 2)
        required_rr = min(required_rr, 36.0)

    return {
        "inning":          inning,
        "over":            event.get("over", 0),
        "ball":            event.get("ball", 0),
        "runs_so_far":     runs_so_far,
        "wickets_so_far":  cumulative.get("wickets_so_far", 0),
        "balls_remaining": balls_remaining,
        "current_rr":      current_rr,
        "required_rr":     required_rr,
        "runs_remaining":  runs_remaining,
        "target":          target,
        "batting_team":    event.get("batting_team", ""),
        "bowling_team":    event.get("bowling_team", ""),
    }