# app/agents/commentary.py

from Backend.core.llm import call_llm
import random

# ── System persona ────────────────────────────────────────────────────────────

_SYSTEM = """You are Ravi Shashtri and Harsha Bhogle combined — the voice of IPL.

Your commentary style:
- Natural Hinglish: mix Hindi words organically (yaar, arre, kya shot, ekdum, mast, zabardast, aur, dekho, bhai)
- SHORT — never more than 20 words per sentence
- Emotionally reactive — you feel every ball like a fan
- Never robotic, never stat-heavy, never formal
- Crowd is always in the background of your mind
- You have memory — you react to the SITUATION not just the ball

NEVER say: "win probability", "percentage", "algorithm", "AI", "model"
NEVER use quotation marks or emojis
NEVER start two consecutive sentences the same way
NEVER sound like a sports report — sound like a person watching live"""

# ── Situation-aware prompt templates ─────────────────────────────────────────

_DOT_CONTEXTS = [
    "dot ball — bowler wins this one",
    "defended solidly, no run",
    "tight line, batter watchful",
    "maiden building up here",
    "pressure mounting with every dot",
]

_SINGLE_CONTEXTS = [
    "rotates strike — smart cricket",
    "quick single, good running",
    "clips it away for one",
    "takes the single, keeps scoreboard ticking",
]

_POWERPLAY_CONTEXTS = [
    "fielding restrictions on — this is the time to attack",
    "powerplay overs, crowd on their feet",
    "inside the six-over window — every boundary counts",
]

_DEATH_CONTEXTS = [
    "death overs — nerves of steel needed here",
    "last four overs — anything can happen",
    "yorker territory — this is Test of skill",
    "crunch time, yaar — crowd is going crazy",
]

_MILESTONE_CONTEXTS = [
    "fifty coming up for this batter",
    "on the verge of a big score here",
    "batter in great touch today",
]

# ── Tone selector based on event ─────────────────────────────────────────────

def _build_tone(event: dict, cumulative_context: dict) -> str:
    runs        = event.get("batsman_runs", 0)
    is_wicket   = event.get("is_wicket", False)
    over        = event.get("over", 0)
    extras      = event.get("extra_runs", 0)
    inning      = event.get("inning", 1)
    is_powerplay = event.get("is_powerplay", False)

    # Wicket — highest drama
    if is_wicket:
        dismissed = event.get("player_dismissed", "the batter")
        kind      = event.get("dismissal_kind", "dismissed")
        return random.choice([
            f"WICKET! {dismissed} is gone — {kind}. React with shock and drama.",
            f"{dismissed} walks back. {kind}. The crowd erupts. Pure disbelief.",
            f"Massive wicket! {dismissed} out {kind}. React like it just changed the game.",
            f"Arre yaar — {dismissed} is OUT! {kind}. Unbelievable scenes.",
        ])

    # Six
    if runs == 6:
        return random.choice([
            f"{event['batter']} sends it into the stands! Pure power. React with electric excitement.",
            f"SIX! {event['batter']} absolutely murders that delivery. React like the crowd just went wild.",
            f"That's gone! Maximum! {event['batter']} hits {event['bowler']} into the crowd. Pure celebration.",
            f"Zabardast! {event['batter']} clears the ropes effortlessly. React with pure joy.",
        ])

    # Four
    if runs == 4:
        return random.choice([
            f"FOUR! {event['batter']} finds the gap perfectly. Elegant and precise.",
            f"Boundary! {event['batter']} times it beautifully off {event['bowler']}. React with appreciation.",
            f"Cracked away for four. {event['batter']} is in great touch today.",
            f"Kya shot! {event['batter']} pierces the field. Brilliant stroke play.",
        ])

    # Wide or no ball
    if extras > 0:
        return random.choice([
            f"Extra run — {event['bowler']} losing control of line here.",
            f"Wasted delivery — {event['bowler']} going wide. Costly in this stage.",
            f"Extras! {event['bowler']} not happy with himself there.",
        ])

    # Dot ball
    if runs == 0:
        situation = random.choice(_DOT_CONTEXTS)
        if over >= 16:
            situation = random.choice(_DEATH_CONTEXTS)
        return f"Dot ball — {situation}. React in ONE natural sentence."

    # 2 or 3 runs
    if runs in (2, 3):
        return f"{event['batter']} works it for {runs} — good running between wickets. One sentence, natural."

    # Single — most common
    context = random.choice(_SINGLE_CONTEXTS)
    if is_powerplay:
        context = random.choice(_POWERPLAY_CONTEXTS)
    return f"{event['batter']} {context}. React naturally in ONE sentence."


# ── Optional match pressure context (rare — feels natural when used) ──────────

def _maybe_add_pressure(win_prob: dict, over: int, inning: int) -> str:
    # Only add pressure context in genuinely tense moments
    batting_prob = win_prob.get("batting_prob", 50)
    is_close     = 35 < batting_prob < 65
    is_late      = over >= 15
    is_2nd_inn   = inning == 2

    # Only fire in genuinely tense moments, and only 20% of those
    if is_close and (is_late or is_2nd_inn) and random.random() < 0.20:
        team = win_prob.get("batting_team", "batting side")
        if batting_prob < 45:
            return f"Match is slipping away from {team} here."
        elif batting_prob > 55:
            return f"{team} in control — but it can change any ball."
        else:
            return "Match is on a knife's edge right now."

    return ""


# ── Main entry point ──────────────────────────────────────────────────────────

async def generate_commentary(event: dict, win_prob: dict) -> str:
    tone     = _build_tone(event, {})
    pressure = _maybe_add_pressure(win_prob, event.get("over", 0), event.get("inning", 1))

    prompt = f"""Generate ONE live IPL commentary sentence.

Ball info:
  Over: {event['over']}.{event['ball']}
  Batter: {event['batter']}
  Bowler: {event['bowler']}
  Runs scored: {event['batsman_runs']}
  Wicket: {event['is_wicket']}
  Dismissed: {event.get('player_dismissed', 'none')}
  Powerplay: {event.get('is_powerplay', False)}
  Innings: {event['inning']}

Tone instruction:
{tone}

{f'Optional context (weave in naturally if it fits): {pressure}' if pressure else ''}

Hard rules:
- Exactly ONE sentence
- Under 20 words
- Hinglish — mix Hindi words naturally
- No stats, no percentages, no AI references
- No quotation marks
- React like a human watching live TV
- Start with something other than "And" or "The"
"""

    return await call_llm(_SYSTEM, prompt)