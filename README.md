<div align="center">

# ⚡ CricketPulse

### Real-time multi-agent IPL AI backend

*Every ball. Three AI agents. One live broadcast.*

[![Python](https://img.shields.io/badge/Python-3.11+-3776ab?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![XGBoost](https://img.shields.io/badge/XGBoost-81.7%25_acc-orange?style=flat-square)](https://xgboost.ai)
[![Groq](https://img.shields.io/badge/Groq-llama--3.1--8b-f55036?style=flat-square)](https://groq.com)
[![Redis](https://img.shields.io/badge/Redis-pub%2Fsub-dc382d?style=flat-square&logo=redis&logoColor=white)](https://redis.io)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

Built at **GDG Raipur — Agentic Premier League Hackathon**, May 24 2026

</div>

---

## What is this?

CricketPulse turns a Cricsheet ball-by-ball JSON into a **live AI broadcast**. The moment an event arrives off the Redis wire, three agents fire in parallel:

| Agent | Type | What it does |
|-------|------|--------------|
| **Win Probability** | XGBoost ML | Predicts P(batting team wins) from 12 match-state features |
| **Commentary** | Groq LLM | Writes one Harsha Bhogle-style sentence per delivery |
| **Alerts** | Rules + LLM | Fires on wickets, fifties, centuries, sixes — LLM called only when needed |

All three results are fused into a single JSON payload and broadcast to every WebSocket client in real time. PostgreSQL gets a background log. The frontend updates without a page refresh.

---

## Architecture

```
Cricsheet JSON
      │
      ▼
emitter.py ──publish──▶ Redis: match:events
                                │
                         [FastAPI subscriber]
                                │
                      event_processor.py
                                │
               ┌────asyncio.gather()────┐
               │                        │
        to_thread(XGBoost)        check_and_alert()
        Win Probability           Rules + Groq LLM
               │                        │
               └───────────┬────────────┘
                            │
                   generate_commentary()
                        Groq LLM
                            │
                   WebSocketPayload
                            │
              ┌─────────────┼─────────────┐
              │             │             │
       WS broadcast    Frontend     create_task(Postgres)
       (all clients)   index.html   (fire-and-forget)
```

**Critical design decisions:**
- `asyncio.gather()` — ML inference and alert check run **concurrently**, not sequentially
- `asyncio.to_thread()` — XGBoost inference offloaded to thread pool, event loop stays unblocked
- Per-client `try/except` in `broadcast()` — one dead WebSocket never kills others
- LLM fallback `"Great delivery!"` — Groq rate limits or timeouts never crash the pipeline
- DB logging is always `create_task()` — never adds to broadcast latency

---

## Project structure

```
CricketPulse/
├── Backend/
│   ├── main.py                  # FastAPI app, lifespan, router registration
│   ├── config.py                # pydantic-settings, reads .env
│   ├── database.py              # async SQLModel engine + session factory
│   ├── agents/
│   │   ├── win_probability.py   # XGBoost inference, 12-feature match state
│   │   ├── commentary.py        # Groq LLM, one sentence per ball
│   │   └── alerts.py            # Rule engine + conditional Groq call
│   ├── core/
│   │   ├── event_processor.py   # Orchestrator — gather, broadcast, log
│   │   ├── redis.py             # Async pub/sub singleton
│   │   ├── ws_manager.py        # WebSocket fan-out with fault isolation
│   │   └── llm.py               # Groq async wrapper + fallback
│   ├── routes/
│   │   ├── health.py            # GET /health
│   │   ├── match.py             # state, history, inject, demo/wicket
│   │   └── websocket.py         # WS /ws
│   ├── schemas/
│   │   ├── event.py             # BallEvent (Pydantic v2)
│   │   ├── payload.py           # WinProbResult, WebSocketPayload
│   │   └── response.py          # HealthResponse, MatchStateResponse, etc.
│   ├── db/
│   │   └── models.py            # BallEventLog, LLMResponseLog (SQLModel)
│   └── emitter/
│       └── emitter.py           # Cricsheet parser + Redis publisher
├── Frontend/
│   └── index.html               # Live dashboard — vanilla JS, no build step
├── models/
│   ├── win_prob.pkl             # Trained XGBoost classifier
│   ├── team_encoder.pkl         # LabelEncoder for team names
│   └── features.pkl             # Feature list (training artifact)
├── docker-compose.yml           # Redis + Postgres
├── requirements.txt
└── PRD.md                       # Full product requirements document
```

---

## Quickstart

### Prerequisites

- Python 3.11+
- Docker Desktop
- A [Groq API key](https://console.groq.com) (free tier works)

### 1. Clone and install

```bash
git clone https://github.com/BackStacked/CricketPulse.git
cd CricketPulse
pip install -r requirements.txt
```

### 2. Configure

```bash
# .env is already created — just add your key
GROQ_API_KEY=gsk_your_key_here
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/cricketpulse
REDIS_CHANNEL=match:events
```

### 3. Start infrastructure

```bash
docker compose up -d
```

### 4. Run the backend

```bash
# Terminal 1
uvicorn Backend.main:app --reload
```

Expected startup output:
```
[CricketPulse] Starting up...
[WinProbAgent] Loaded — 81.7% acc, 0.91 AUC
[CricketPulse] Redis connected
[CricketPulse] Subscribed to Redis channel: match:events
[CricketPulse] Ready — waiting for ball events...
```

### 5. Start the emitter

```bash
# Terminal 2
python -m Backend.emitter.emitter --file 1529309.json --speed demo
```

### 6. Open the dashboard

Open `Frontend/index.html` directly in your browser. The dot turns green and ball events start flowing.

---

## Speed modes

| Flag | Delay per ball | Use case |
|------|---------------|----------|
| `--speed slow` | 8s | Watch carefully |
| `--speed normal` | 4s | Default |
| `--speed demo` | 2s | Hackathon demo |
| `--speed fast` | 1s | Quick integration test |

---

## API reference

**Docs:** `http://localhost:8000/docs` (Swagger UI auto-generated)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Redis, DB, model status |
| `GET` | `/match/state` | Current in-memory match state |
| `GET` | `/match/history?limit=20` | Last N balls from Postgres |
| `POST` | `/match/event` | Inject any `BallEvent` into the pipeline |
| `POST` | `/demo/wicket` | Force a Rohit Sharma caught dismissal |
| `WS` | `/ws` | Live `WebSocketPayload` stream |

### WebSocket payload shape

Every ball emits this JSON to all connected clients:

```json
{
  "ball": {
    "match_id": "1529309",
    "inning": 1,
    "batting_team": "Gujarat Titans",
    "bowling_team": "Chennai Super Kings",
    "over": 7,
    "ball": 3,
    "batter": "Shubman Gill",
    "bowler": "Mukesh Choudhary",
    "non_striker": "B Sai Sudharsan",
    "batsman_runs": 1,
    "extra_runs": 0,
    "total_runs": 1,
    "is_wicket": false,
    "player_dismissed": null,
    "dismissal_kind": null,
    "is_powerplay": false
  },
  "win_prob": {
    "batting_team": "Gujarat Titans",
    "bowling_team": "Chennai Super Kings",
    "batting_prob": 64.2,
    "bowling_prob": 35.8
  },
  "commentary": "Shubman Gill clips it fine for a cheeky single as Gujarat continue to build steadily.",
  "alert": null,
  "timestamp": "2026-05-24T14:22:01.123456Z"
}
```

---

## ML model

The win probability model was trained on IPL historical ball-by-ball data from Cricsheet.

| Attribute | Value |
|-----------|-------|
| Algorithm | XGBoost (`XGBClassifier`) |
| Accuracy | **81.7%** |
| AUC-ROC | **0.91** |
| Features | 12 (inning, over, ball, runs, wickets, balls_remaining, CRR, RRR, runs_remaining, target, batting_team_enc, bowling_team_enc) |
| Target | `winner == batting_team` (binary) |
| Serialization | `joblib` |

Run `ML Model/train_win_prob.ipynb` to retrain on updated data.

---

## Demo script (for judges)

```bash
# 1. Start infrastructure + backend (see Quickstart above)

# 2. Open Frontend/index.html in browser
#    → dot shows "Live", dashboard is waiting

# 3. Start emitter
python -m Backend.emitter.emitter --file 1529309.json --speed demo

# 4. Watch win probability bar shift every 2 seconds
# 5. Watch commentary appear for every ball
# 6. Wait for a wicket — red alert banner fires

# 7. Force an instant wicket anytime (works mid-match):
curl -X POST http://localhost:8000/demo/wicket

# 8. Show persistent DB history:
curl http://localhost:8000/match/history

# 9. Show Swagger UI:
#    http://localhost:8000/docs

# 10. Use --demo-wicket flag to force wicket at specific ball:
python -m Backend.emitter.emitter --file 1529309.json --speed demo --demo-wicket 10
```

---

## Frontend dashboard

Zero dependencies. Open `Frontend/index.html` in any browser.

- **Win probability bar** — animated two-sided bar, purple (batting) vs teal (bowling), transitions smoothly on every ball
- **Commentary feed** — last 10 deliveries, newest on top, fade-in animation
- **Alert banner** — flashes red for wickets/milestones, auto-dismisses after 4 seconds
- **Ball log chips** — last 20 balls: gray dot, blue 1-3, green 4, amber 6, red W
- **Connection indicator** — pulsing green when live, auto-reconnects on disconnect

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| API framework | FastAPI + uvicorn |
| Real-time transport | WebSocket (native FastAPI) |
| Message bus | Redis pub/sub |
| Database | PostgreSQL 15 via asyncpg + SQLModel |
| ORM / validation | SQLModel + Pydantic v2 |
| ML model | XGBoost |
| LLM | Groq Cloud — `llama-3.1-8b-instant` |
| Config | pydantic-settings |
| Serialization | joblib (model), json (Redis) |
| Infra | Docker Compose |
| Frontend | Vanilla JS + CSS custom properties |

---

## Fault tolerance guarantees

| Failure scenario | Behaviour |
|-----------------|-----------|
| Groq API down / rate limited | Returns `"Great delivery!"` — pipeline never crashes |
| PostgreSQL unreachable | DB log silently skipped — broadcast continues |
| Dead WebSocket client | Client pruned silently — other clients unaffected |
| Unknown team name in ML encoder | Falls back to index 0 — no exception |
| Model file missing | Returns 50/50 — `/health` reports `model_loaded: false` |

---

## Contributing

1. Fork the repo
2. Add your agent under `Backend/agents/`
3. Wire it into `event_processor.py` inside `asyncio.gather()`
4. Add its output field to `WebSocketPayload` in `schemas/payload.py`
5. Open a PR

Agent pattern is deliberately isolated — adding a new agent does not touch routes, WebSocket, or DB layers.

---

## License

MIT — see [LICENSE](LICENSE)

---

<div align="center">

Built with Python, XGBoost, Groq, Redis, FastAPI, and a love for cricket.

**GDG Raipur — Agentic Premier League, May 24 2026**

</div>
