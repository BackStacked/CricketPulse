# CricketPulse ⚡

Real-time multi-agent IPL AI backend — GDG Raipur, Agentic Premier League Hackathon (May 24 2026).
Every ball triggers 3 AI agents in parallel: ML win probability, LLM commentary, and a rule+LLM alert system, all broadcast live over WebSocket.

---

## Setup

```bash
git clone <repo>
pip install -r requirements.txt

# Start infrastructure
docker compose up -d          # Redis + Postgres

# Terminal 1 — backend
uvicorn Backend.main:app --reload

# Terminal 2 — emitter
python -m Backend.emitter.emitter --file "1529309.json" --speed demo
```

Set your Groq API key in `.env`:
```
GROQ_API_KEY=your_key_here
```

---

## Demo flow (show judges in this order)

1. Open `Frontend/index.html` in browser — show "Connecting..." → "Live" once backend starts
2. Start the emitter — ball-by-ball output appears in Terminal 2, backend prints win probs in Terminal 1
3. Watch the win probability bar shift on every ball
4. Commentary appears in the feed for every delivery
5. Wait for a wicket in the match — alert banner fires red
6. To force an instant wicket for judges:
   ```bash
   curl -X POST http://localhost:8000/demo/wicket
   ```
7. Show API docs: `http://localhost:8000/docs`
8. Show DB persistence: `GET http://localhost:8000/match/history`

---

## Tech stack

| Layer | Technology |
|---|---|
| API | FastAPI + uvicorn |
| Real-time | WebSocket (FastAPI native) |
| Message bus | Redis pub/sub |
| Database | PostgreSQL via SQLModel + asyncpg |
| ML model | XGBoost (81.7% acc, 0.91 AUC) |
| LLM | Groq — llama-3.1-8b-instant |
| Config | pydantic-settings |
| Infra | Docker Compose |

---

## Architecture

```
Cricsheet JSON
     │
     ▼
emitter.py ──publish──▶ Redis channel (match:events)
                               │
                               ▼
                      main.py subscriber
                               │
                         event_processor.py
                        ┌──────┴──────┐
               asyncio.gather()       │
              ┌─────┬───────┐         │
         ML model  Alerts  Commentary │
          (XGB)   (rules   (Groq LLM) │
                   +LLM)              │
              └─────┴───────┘         │
                      │               │
                 WebSocket broadcast──┘
                      │
               Frontend dashboard
                      │
               Postgres log (bg task)
```

**Components:**
- `Backend/emitter/emitter.py` — parses Cricsheet JSON, replays ball-by-ball to Redis
- `Backend/core/event_processor.py` — orchestrates all 3 agents with `asyncio.gather()`
- `Backend/agents/win_probability.py` — XGBoost model, 12-feature match state
- `Backend/agents/commentary.py` — Groq LLM, one-sentence Harsha Bhogle style
- `Backend/agents/alerts.py` — rule engine (wicket/50/100/six) + Groq LLM
- `Backend/core/ws_manager.py` — broadcast with per-client fault isolation
- `Backend/core/redis.py` — async pub/sub singleton
- `Backend/core/llm.py` — Groq async wrapper with "Great delivery!" fallback
- `Backend/database.py` — async SQLModel engine, table creation, session factory
- `Backend/routes/match.py` — state, history, manual event injection, demo wicket
- `Frontend/index.html` — single-file dashboard, no build step
