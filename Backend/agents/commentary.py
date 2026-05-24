from Backend.core.llm import call_llm

_SYSTEM = (
    "You are a cricket commentator like Harsha Bhogle. Write exactly ONE sentence of live "
    "commentary. Be dramatic on wickets and sixes. Use the player names and win probability context."
)


async def generate_commentary(event: dict, win_prob: dict) -> str:
    prompt = (
        f"Ball: Over {event['over']}.{event['ball']}, {event['batter']} faces {event['bowler']}. "
        f"Runs this ball: {event['batsman_runs']}. Extras: {event['extra_runs']}. "
        f"Wicket: {event['is_wicket']}. Player dismissed: {event.get('player_dismissed', 'None')}. "
        f"Win probability — {win_prob['batting_team']}: {win_prob['batting_prob']}%, "
        f"{win_prob['bowling_team']}: {win_prob['bowling_prob']}%."
    )
    return await call_llm(_SYSTEM, prompt)
