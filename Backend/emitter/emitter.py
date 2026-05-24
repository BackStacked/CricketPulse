"""
Standalone emitter — run in a separate terminal, never imported by FastAPI.

Usage:
  python -m Backend.emitter.emitter --file path/to/match.json --speed normal
"""
import argparse
import asyncio
import json
from pathlib import Path

import redis.asyncio as aioredis

from Backend.config import settings

SPEED_MAP = {
    "slow": 8.0,
    "normal": 4.0,
    "fast": 1.0,
    "demo": 2.0,
}


async def redis_publish(channel: str, data: dict):
    client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
    await client.publish(channel, json.dumps(data))
    await client.aclose()


def parse_match(filepath: Path) -> tuple[dict, list]:
    with open(filepath, encoding="utf-8") as f:
        data = json.load(f)

    info = data["info"]
    teams = info["teams"]
    venue = info.get("venue", "Unknown Venue")
    season = info.get("season", "Unknown Season")
    dates = info.get("dates", ["Unknown Date"])

    balls = []
    match_id = filepath.stem

    for inning_idx, inning in enumerate(data["innings"]):
        if inning_idx >= 2:
            continue

        batting_team = inning["team"]
        bowling_team = next(t for t in teams if t != batting_team)
        inning_num = inning_idx + 1

        for over_obj in inning.get("overs", []):
            over_num = over_obj["over"]
            for ball_idx, delivery in enumerate(over_obj.get("deliveries", [])):
                wickets = delivery.get("wickets", [])
                is_wicket = len(wickets) > 0
                player_dismissed = wickets[0]["player_out"] if is_wicket else None
                dismissal_kind = wickets[0]["kind"] if is_wicket else None

                ball_event = {
                    "match_id": match_id,
                    "inning": inning_num,
                    "batting_team": batting_team,
                    "bowling_team": bowling_team,
                    "over": over_num,
                    "ball": ball_idx,
                    "batter": delivery["batter"],
                    "bowler": delivery["bowler"],
                    "non_striker": delivery["non_striker"],
                    "batsman_runs": delivery["runs"]["batter"],
                    "extra_runs": delivery["runs"]["extras"],
                    "total_runs": delivery["runs"]["total"],
                    "is_wicket": is_wicket,
                    "player_dismissed": player_dismissed,
                    "dismissal_kind": dismissal_kind,
                    "is_powerplay": over_num < 6,
                }
                balls.append(ball_event)

    meta = {
        "teams": teams,
        "venue": venue,
        "season": season,
        "date": dates[0] if dates else "Unknown",
        "match_id": match_id,
    }
    return meta, balls


async def emit(filepath: Path, speed: float, force_wicket_after: int = 0):
    meta, balls = parse_match(filepath)

    print(f"\n{'='*60}")
    print(f"  CricketPulse Emitter")
    print(f"  Match: {meta['teams'][0]} vs {meta['teams'][1]}")
    print(f"  Venue: {meta['venue']}")
    print(f"  Season: {meta['season']}  |  Date: {meta['date']}")
    print(f"  Total balls: {len(balls)}  |  Speed: {speed}s/ball")
    print(f"{'='*60}\n")

    innings1_runs = innings1_wickets = 0
    innings2_runs = innings2_wickets = 0
    forced_wicket_done = False

    for i, ball in enumerate(balls):
        # Optional forced wicket injection for demo
        if force_wicket_after > 0 and i == force_wicket_after and not forced_wicket_done:
            ball = dict(ball)
            ball["is_wicket"] = True
            ball["player_dismissed"] = ball["batter"]
            ball["dismissal_kind"] = "caught"
            forced_wicket_done = True
            print(f"  [DEMO] Injecting forced wicket at ball {i}")

        powerplay_str = "PP" if ball["is_powerplay"] else "  "
        wicket_str = " [W]" if ball["is_wicket"] else ""
        print(
            f"  [{ball['inning']}.{ball['over']:02d}.{ball['ball']}] {powerplay_str} "
            f"{ball['batter']:<20} vs {ball['bowler']:<20} | "
            f"{ball['batsman_runs']} runs{wicket_str}"
        )

        await redis_publish(settings.REDIS_CHANNEL, ball)

        if ball["inning"] == 1:
            innings1_runs += ball["total_runs"]
            if ball["is_wicket"]:
                innings1_wickets += 1
        else:
            innings2_runs += ball["total_runs"]
            if ball["is_wicket"]:
                innings2_wickets += 1

        await asyncio.sleep(speed)

    print(f"\n{'='*60}")
    print(f"  Match Complete!")
    print(f"  {meta['teams'][0]}: {innings1_runs}/{innings1_wickets}")
    print(f"  {meta['teams'][1]}: {innings2_runs}/{innings2_wickets}")
    print(f"{'='*60}\n")


def main():
    parser = argparse.ArgumentParser(description="CricketPulse Emitter")
    parser.add_argument("--file", required=True, help="Path to Cricsheet JSON file")
    parser.add_argument(
        "--speed",
        choices=list(SPEED_MAP.keys()),
        default="normal",
        help="Replay speed",
    )
    parser.add_argument(
        "--demo-wicket",
        type=int,
        default=0,
        metavar="BALL_NUM",
        help="Force a wicket after N balls (0=disabled)",
    )
    args = parser.parse_args()

    filepath = Path(args.file)
    if not filepath.exists():
        print(f"ERROR: File not found: {filepath}")
        return

    speed = SPEED_MAP[args.speed]
    asyncio.run(emit(filepath, speed, force_wicket_after=args.demo_wicket))


if __name__ == "__main__":
    main()
