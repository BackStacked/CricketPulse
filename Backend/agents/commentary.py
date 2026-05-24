from Backend.core.llm import call_llm

_SYSTEM = (
    "You are an energetic IPL-style cricket commentator like Harsha Bhogle mixed with modern Hindi-English "
    "commentary. Write EXACTLY ONE exciting sentence of live ball-by-ball commentary in Hinglish "
    "(Hindi + English mix). "
    "Rules: "
    "- Sound natural and hype. "
    "- React dramatically for wickets, fours, and sixes. "
    "- Mention batter or bowler names naturally. "
    "- Occasionally use phrases like 'kya baat hai', 'arey wah', 'clean bowled', 'stadium goes crazy', etc. "
    "- Include win probability pressure context when suitable. "
    "- Keep it under 30 words."
)


async def generate_commentary(event: dict, win_prob: dict) -> str:
    prompt = (
        f"Match Situation:\n"
        f"Over: {event['over']}.{event['ball']}\n"
        f"Batter: {event['batter']}\n"
        f"Bowler: {event['bowler']}\n"
        f"Runs scored: {event['batsman_runs']}\n"
        f"Extras: {event['extra_runs']}\n"
        f"Wicket fallen: {event['is_wicket']}\n"
        f"Dismissed player: {event.get('player_dismissed', 'None')}\n"
        f"Batting team win probability: {win_prob['batting_prob']}%\n"
        f"Bowling team win probability: {win_prob['bowling_prob']}%\n"
        f"Generate one thrilling Hinglish commentary line."
    )

    return await call_llm(_SYSTEM, prompt)