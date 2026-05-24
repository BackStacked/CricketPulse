from Backend.core.llm import call_llm

_ALERT_SYSTEM = "You are a cricket commentator."


async def check_and_alert(event: dict, cumulative: dict) -> str | None:
    batter = event["batter"]
    batter_runs_before = cumulative.get("batter_runs", {}).get(batter, 0) - event["batsman_runs"]

    if event["is_wicket"]:
        prompt = (
            f"WICKET! {event['player_dismissed']} is out "
            f"{event.get('dismissal_kind', 'dismissed')}! "
            f"Write one dramatic send-off line."
        )
        return await call_llm(_ALERT_SYSTEM, prompt, max_tokens=80)

    if batter_runs_before < 100 <= cumulative.get("batter_runs", {}).get(batter, 0):
        prompt = f"CENTURY! {batter} has scored 100 runs! Write one celebratory line."
        return await call_llm(_ALERT_SYSTEM, prompt, max_tokens=80)

    if batter_runs_before < 50 <= cumulative.get("batter_runs", {}).get(batter, 0):
        prompt = f"FIFTY! {batter} has reached 50 runs! Write one celebratory line."
        return await call_llm(_ALERT_SYSTEM, prompt, max_tokens=80)

    if event["batsman_runs"] == 6:
        prompt = f"SIX! {batter} hits {event['bowler']} for a maximum! One line."
        return await call_llm(_ALERT_SYSTEM, prompt, max_tokens=80)

    over_deliveries = cumulative.get("over_deliveries", 0)
    if event["over"] == 19 and over_deliveries >= 5:
        prompt = f"End of innings! Write one dramatic closing line for {event['batting_team']}."
        return await call_llm(_ALERT_SYSTEM, prompt, max_tokens=80)

    return None
