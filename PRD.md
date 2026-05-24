# CricketPulse — Product Requirements Document

**Version:** 1.0  
**Date:** May 24, 2026  
**Author:** CricketPulse Team  
**Hackathon:** GDG Raipur — Agentic Premier League  
**Repo:** https://github.com/BackStacked/CricketPulse

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [Users & Stakeholders](#4-users--stakeholders)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [System Architecture](#7-system-architecture)
8. [Agent Specifications](#8-agent-specifications)
9. [ML Model Specification](#9-ml-model-specification)
10. [Data Models](#10-data-models)
11. [API Specification](#11-api-specification)
12. [Frontend Requirements](#12-frontend-requirements)
13. [Infrastructure & DevOps](#13-infrastructure--devops)
14. [Security](#14-security)
15. [Out of Scope](#15-out-of-scope)
16. [Glossary](#16-glossary)

---

## 1. Executive Summary

CricketPulse is a **real-time, multi-agent AI backend** for live IPL cricket matches. Every ball bowled triggers a parallel pipeline of three independent AI agents — a trained XGBoost classifier computing win probability, a Groq-powered LLM generating Harsha Bhogle-style commentary, and a rule+LLM hybrid alerting on milestone events (wickets, fifties, centuries, sixes). Results from all three agents are fused into a single WebSocket payload and broadcast to all connected clients within milliseconds.

The system ingests Cricsheet-format JSON match files through a standalone emitter process, publishes events to a Redis pub/sub channel, processes them asynchronously in FastAPI, persists logs to PostgreSQL, and delivers a live dashboard via a zero-dependency HTML frontend.

---

## 2. Problem Statement

### Current state

Traditional cricket broadcasts rely on a single commentary team and manual statistical overlays. Existing digital platforms like Cricbuzz and ESPNcricinfo provide real-time scores but lack:

- **Probabilistic insight** — no live win probability that updates on every ball
- **AI-generated narrative** — commentary is human-only; no AI agent generating parallel context
- **Programmable event detection** — alerts for milestones are hardcoded, not agent-driven
- **Developer-accessible APIs** — no open, real-time API for cricket state consumption

### The gap

There is no open-source backend that:
1. Ingests real Cricsheet match data
2. Runs multiple AI agents in parallel per ball delivery
3. Exposes live state via WebSocket + REST
4. Persists every delivery with ML probabilities and LLM output

CricketPulse fills this gap.

---

## 3. Goals & Success Metrics

### Goals

| # | Goal |
|---|------|
| G1 | Process every ball event end-to-end (ingest → agents → broadcast) in under 3 seconds |
| G2 | Win probability updates on every single delivery with no dropped events |
| G3 | LLM commentary and alert generation must never crash the pipeline — always fallback |
| G4 | WebSocket broadcast must tolerate dead clients without affecting healthy ones |
| G5 | All ball events persisted to PostgreSQL as background tasks without blocking broadcast |
| G6 | Frontend dashboard reflects live state with no page refresh |
| G7 | System can replay any Cricsheet IPL JSON match file via the emitter |

### Success Metrics

| Metric | Target |
|--------|--------|
| Win probability model accuracy | ≥ 80% |
| Win probability model AUC-ROC | ≥ 0.90 |
| Event processing latency (p95) | < 3s end-to-end |
| LLM fallback trigger rate | < 5% under normal load |
| WebSocket delivery success rate | > 99% per connected client |
| Zero crashes | No unhandled exceptions in the broadcast pipeline |
| Innings transition correctness | 100% — score resets cleanly on inning 2 first ball |

---

## 4. Users & Stakeholders

### Primary users

| User | Description | Core Need |
|------|-------------|-----------|
| **Hackathon Judge** | Evaluates technical depth, agentic design, and live demo | See agents firing in real time, impressive visuals, accurate ML |
| **Developer / Integrator** | Consumes the REST + WebSocket API to build a frontend or analytics tool | Stable, documented API with predictable payload schema |
| **Cricket Fan** | Watches the live dashboard during an IPL match | Real-time score, intuitive win probability visualization, dramatic commentary |

### Secondary stakeholders

- **GDG Raipur organizers** — want a production-quality demo reflecting agentic AI patterns
- **Future contributors** — open-source codebase that is readable and extensible

---

## 5. Functional Requirements

### 5.1 Event Ingestion (Emitter)

| ID | Requirement |
|----|-------------|
| F-E1 | Emitter reads any Cricsheet IPL JSON file from disk |
| F-E2 | Emitter parses both innings (skips super overs at index ≥ 2) |
| F-E3 | Emitter maps every delivery to a `BallEvent` schema |
| F-E4 | Emitter publishes each `BallEvent` as JSON to Redis channel `match:events` |
| F-E5 | Emitter supports speed modes: `slow` (8s), `normal` (4s), `demo` (2s), `fast` (1s) |
| F-E6 | Emitter supports `--demo-wicket N` flag to force a wicket at ball N for demo reliability |
| F-E7 | Emitter prints ball-by-ball progress to stdout |
| F-E8 | Emitter prints match summary (team totals) when replay is complete |
| F-E9 | Emitter handles optional Cricsheet fields: `wickets`, `extras`, `review`, `replacements` |

### 5.2 Event Processing Pipeline

| ID | Requirement |
|----|-------------|
| F-P1 | Backend subscribes to Redis channel on startup via an `asyncio` background task |
| F-P2 | Each received event updates cumulative match state **before** agent calls |
| F-P3 | Innings transition is detected on first ball of inning 2; cumulative state resets correctly |
| F-P4 | Win probability agent and alerts agent run **concurrently** via `asyncio.gather()` |
| F-P5 | Commentary agent runs after win prob is available (uses prob as context) |
| F-P6 | All three agent results are fused into a single `WebSocketPayload` |
| F-P7 | WebSocket payload is broadcast to all connected clients |
| F-P8 | Every event is logged to PostgreSQL as a `asyncio.create_task()` — never blocks broadcast |
| F-P9 | Every ball event prints a structured log line to terminal |

### 5.3 Win Probability Agent

| ID | Requirement |
|----|-------------|
| F-W1 | Model loads once at server startup from `models/win_prob.pkl` — never per request |
| F-W2 | Model predicts from 12-feature match state vector on every delivery |
| F-W3 | Innings 2 features include required run rate and runs remaining |
| F-W4 | Unknown team names fall back to encoding index 0 — no crash |
| F-W5 | If model is `None` (failed to load), returns 50/50 fallback |
| F-W6 | Runs in a thread pool via `asyncio.to_thread()` to avoid blocking event loop |

### 5.4 Commentary Agent

| ID | Requirement |
|----|-------------|
| F-C1 | Generates exactly one sentence per delivery using Groq `llama-3.1-8b-instant` |
| F-C2 | Prompt includes: batter, bowler, over, ball, runs, extras, wicket status, win probabilities |
| F-C3 | Commentary must be dramatic on wickets and sixes |
| F-C4 | On any Groq API error (rate limit, timeout, network): returns `"Great delivery!"` — never raises |

### 5.5 Alerts Agent

| ID | Requirement |
|----|-------------|
| F-A1 | Checks milestone conditions in priority order — returns on first match |
| F-A2 | Wicket alert: fires on `is_wicket == True` with dismissal context |
| F-A3 | Century alert: fires when batter's cumulative runs cross 100 on this delivery |
| F-A4 | Fifty alert: fires when batter's cumulative runs cross 50 on this delivery |
| F-A5 | Six alert: fires on `batsman_runs == 6` |
| F-A6 | End-of-innings alert: fires on over 19 last delivery |
| F-A7 | Returns `None` with no LLM call when no milestone matches |
| F-A8 | On any Groq error: returns `"Great delivery!"` — never raises |

### 5.6 WebSocket

| ID | Requirement |
|----|-------------|
| F-WS1 | Endpoint at `GET /ws` accepts and maintains WebSocket connections |
| F-WS2 | Broadcast sends full `WebSocketPayload` JSON to all active connections per event |
| F-WS3 | One dead/disconnected client must never interrupt broadcast to others |
| F-WS4 | Dead clients are pruned silently from the connection set |

### 5.7 REST API

| ID | Requirement |
|----|-------------|
| F-R1 | `GET /health` — returns Redis ping, DB ping, model loaded status |
| F-R2 | `GET /match/state` — returns current cumulative match state |
| F-R3 | `GET /match/history?limit=N` — returns last N ball logs from PostgreSQL |
| F-R4 | `POST /match/event` — accepts a `BallEvent` body and injects it into the pipeline |
| F-R5 | `POST /demo/wicket` — injects a hardcoded Rohit Sharma caught dismissal for live demo |

### 5.8 Persistence

| ID | Requirement |
|----|-------------|
| F-DB1 | Every processed ball is persisted to `BallEventLog` table |
| F-DB2 | Persisted record includes: match_id, inning, over, ball, teams, batter, bowler, total_runs, is_wicket, player_dismissed, win_prob_batting, win_prob_bowling, commentary, alert, timestamp |
| F-DB3 | DB logging never blocks the broadcast pipeline — always `asyncio.create_task()` |
| F-DB4 | DB errors are swallowed silently — pipeline always continues |

### 5.9 Frontend

| ID | Requirement |
|----|-------------|
| F-FE1 | Single HTML file with no build step, no npm, no bundler |
| F-FE2 | WebSocket connects to `ws://localhost:8000/ws` on page load |
| F-FE3 | Auto-reconnects every 3 seconds on disconnect |
| F-FE4 | Displays: batting team, bowling team, score, over, innings, target |
| F-FE5 | Win probability shown as animated two-sided bar (purple = batting, teal = bowling) |
| F-FE6 | Commentary feed shows last 10 entries, newest on top, with fade-in animation |
| F-FE7 | Alert banner flashes on wicket/milestone, auto-hides after 4 seconds |
| F-FE8 | Ball log shows last 20 deliveries as color-coded chips: gray=dot, blue=1-3, green=4, amber=6, red=W |
| F-FE9 | Connection status indicator: green pulsing dot = Live, red = Disconnected |

---

## 6. Non-Functional Requirements

### 6.1 Reliability

| ID | Requirement |
|----|-------------|
| NF-R1 | LLM failure must never propagate — always return a fallback string |
| NF-R2 | DB failure must never propagate — always continue broadcast |
| NF-R3 | One disconnected WebSocket client must not affect others |
| NF-R4 | Redis subscriber task is launched as a background coroutine — FastAPI remains responsive |

### 6.2 Performance

| ID | Requirement |
|----|-------------|
| NF-P1 | ML inference runs in `asyncio.to_thread()` — does not block event loop |
| NF-P2 | Win prob + alerts run concurrently via `asyncio.gather()` — not sequentially |
| NF-P3 | DB logging is fire-and-forget — does not add to broadcast latency |
| NF-P4 | No per-request model loading — model is a module-level singleton |

### 6.3 Maintainability

| ID | Requirement |
|----|-------------|
| NF-M1 | All secrets via `pydantic-settings` from `.env` — nothing hardcoded |
| NF-M2 | Agents are independent modules — win_probability, commentary, alerts can be modified without touching each other |
| NF-M3 | Emitter is always a standalone process — never imported by FastAPI |
| NF-M4 | Schema layer (Pydantic v2) separates validation from business logic |

### 6.4 Extensibility

| ID | Requirement |
|----|-------------|
| NF-E1 | New agents can be added to `event_processor.py` without changing router or WebSocket layer |
| NF-E2 | New REST routes can be added under `Backend/routes/` and registered in `main.py` |
| NF-E3 | The `WebSocketPayload` schema is the single source of truth for frontend contract |

---

## 7. System Architecture

### 7.1 Component diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          INGEST LAYER                               │
│                                                                     │
│   Cricsheet JSON ──▶ emitter.py ──publish──▶ Redis: match:events   │
│   (standalone terminal process, never imported by FastAPI)          │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ subscribe
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         FASTAPI BACKEND                             │
│                                                                     │
│   main.py lifespan                                                  │
│   ├── load_model()           XGBoost loads once                     │
│   ├── create_db_tables()     Postgres schema init                   │
│   ├── redis.ping()           connectivity check                     │
│   └── subscribe_to_channel() background asyncio task               │
│                                                                     │
│   core/event_processor.py  (hot path, per ball)                    │
│   ├── update_cumulative()                                           │
│   ├── asyncio.gather()                                              │
│   │   ├── to_thread(predict_win_probability)  ← ML agent           │
│   │   └── check_and_alert()                  ← Rules+LLM agent     │
│   ├── generate_commentary()                  ← LLM agent           │
│   ├── ws_manager.broadcast()                 ← WebSocket fan-out   │
│   └── create_task(log_to_db())               ← Fire-and-forget     │
│                                                                     │
│   Routes                                                            │
│   ├── GET  /health                                                  │
│   ├── GET  /match/state                                             │
│   ├── GET  /match/history                                           │
│   ├── POST /match/event      (manual injection)                     │
│   ├── POST /demo/wicket      (demo hardening)                       │
│   └── WS   /ws                                                      │
└─────────┬───────────────────────┬───────────────────────────────────┘
          │ persist (bg)          │ broadcast (WebSocket)
          ▼                       ▼
┌──────────────┐        ┌──────────────────────────────┐
│  PostgreSQL  │        │  Frontend/index.html          │
│              │        │  (vanilla JS, no build step)  │
│ BallEventLog │        │  ├── Win probability bar      │
│ LLMRespLog   │        │  ├── Commentary feed          │
└──────────────┘        │  ├── Alert banner             │
                        │  └── Ball log chips           │
                        └──────────────────────────────┘
```

### 7.2 Data flow per ball event

```
1. emitter.py         → publishes BallEvent JSON to Redis
2. Redis subscriber   → receives message, calls on_event()
3. event_processor    → updates cumulative match state
4. asyncio.gather()   → fires ML agent + alerts agent concurrently
5. commentary agent   → fires after gather() (needs win_prob context)
6. WebSocketPayload   → assembled from all three agent results
7. ws_manager         → broadcasts payload to all WS clients
8. create_task()      → logs to Postgres in background
```

### 7.3 Fault isolation design

| Failure | Isolation | Fallback |
|---------|-----------|----------|
| Groq API down | `try/except` in `call_llm()` | Returns `"Great delivery!"` |
| PostgreSQL down | `try/except` in `log_to_db()` | Swallowed, pipeline continues |
| Dead WebSocket client | `try/except` per client in `broadcast()` | Client removed, others unaffected |
| Unknown team name | `try/except` in `predict_win_probability()` | Encoding fallback to 0 |
| Model not loaded | `if _model is None` check | Returns 50/50 |

---

## 8. Agent Specifications

### 8.1 Win Probability Agent

**File:** `Backend/agents/win_probability.py`  
**Type:** Deterministic ML inference (no LLM)

**Inputs (12 features):**

| Feature | Description | Notes |
|---------|-------------|-------|
| `inning` | Current innings (1 or 2) | — |
| `over` | Current over (0-indexed) | — |
| `ball` | Ball within over (0-indexed) | — |
| `runs_so_far` | Cumulative runs this innings | Resets on innings 2 |
| `wickets_so_far` | Cumulative wickets this innings | Resets on innings 2 |
| `balls_remaining` | `max(120 - ball_number, 0)` | — |
| `current_rr` | `runs / overs_elapsed`, capped at 36 | 0 if first ball |
| `required_rr` | Innings 2 only; capped at 36 | 0 in innings 1 |
| `runs_remaining` | `max(target - runs, 0)`, innings 2 only | 0 in innings 1 |
| `target` | Innings 1 total + 1 | 0 in innings 1 |
| `batting_team_enc` | LabelEncoder integer | Fallback: 0 |
| `bowling_team_enc` | LabelEncoder integer | Fallback: 0 |

**Output:**
```json
{
  "batting_team": "Gujarat Titans",
  "bowling_team": "Chennai Super Kings",
  "batting_prob": 64.2,
  "bowling_prob": 35.8
}
```

**Threading:** Wrapped in `asyncio.to_thread()` — XGBoost inference is CPU-bound.

### 8.2 Commentary Agent

**File:** `Backend/agents/commentary.py`  
**Type:** LLM (Groq `llama-3.1-8b-instant`)

**Trigger:** Every ball, unconditionally.

**System prompt:**
> "You are a cricket commentator like Harsha Bhogle. Write exactly ONE sentence of live commentary. Be dramatic on wickets and sixes. Use the player names and win probability context."

**Context injected:** over, ball, batter, bowler, runs, extras, wicket status, player dismissed, win probabilities for both teams.

**Max tokens:** 150  
**Fallback:** `"Great delivery!"`

### 8.3 Alerts Agent

**File:** `Backend/agents/alerts.py`  
**Type:** Rule engine + LLM (conditional Groq calls)

**Milestone priority chain:**

| Priority | Condition | LLM Prompt Style |
|----------|-----------|-----------------|
| 1 | `is_wicket == True` | Dramatic send-off line |
| 2 | Batter crosses 100 runs this delivery | Celebratory century line |
| 3 | Batter crosses 50 runs this delivery | Celebratory fifty line |
| 4 | `batsman_runs == 6` | Six hit line |
| 5 | Over 19, last delivery | Innings close line |
| — | No match | `return None` (no LLM call) |

**Key design:** only the highest-priority milestone triggers an LLM call. No milestone = no Groq request = no latency.

**Max tokens:** 80  
**Fallback:** `"Great delivery!"`

---

## 9. ML Model Specification

### 9.1 Training data

| Attribute | Value |
|-----------|-------|
| Source | Cricsheet IPL ball-by-ball CSVs |
| Matches | IPL historical (multiple seasons) |
| Target variable | `winner == batting_team` (binary) |
| Training format | One row per ball delivery |

### 9.2 Model

| Attribute | Value |
|-----------|-------|
| Algorithm | XGBoost (`XGBClassifier`) |
| Accuracy | **81.7%** |
| AUC-ROC | **0.91** |
| Serialization | `joblib` → `models/win_prob.pkl` |
| Team encoder | `LabelEncoder` → `models/team_encoder.pkl` |
| Feature list | `models/features.pkl` |

### 9.3 Feature engineering

- **Current run rate:** derived from `runs_so_far / overs_elapsed`, capped at 36
- **Required run rate:** `runs_remaining / (balls_remaining / 6)`, innings 2 only, capped at 36
- **Balls remaining:** `max(120 - ball_number, 0)` — models urgency
- **Target:** `innings1_total + 1` — set at innings transition

### 9.4 Model loading contract

- Loaded **once** in `main.py` lifespan startup via `load_model()`
- Module-level globals `_model` and `_encoder`
- Never reloaded per request
- Thread-safe for concurrent reads (XGBoost predict_proba is read-only)

---

## 10. Data Models

### 10.1 Pydantic schemas (request/response)

#### `BallEvent` (ingest schema)

```python
class BallEvent(BaseModel):
    match_id: str
    inning: int              # 1 or 2
    batting_team: str
    bowling_team: str
    over: int                # 0-indexed
    ball: int                # 0-indexed within over
    batter: str
    bowler: str
    non_striker: str
    batsman_runs: int
    extra_runs: int
    total_runs: int
    is_wicket: bool
    player_dismissed: str | None = None
    dismissal_kind: str | None = None
    is_powerplay: bool = False    # over < 6
```

#### `WebSocketPayload` (broadcast schema)

```python
class WebSocketPayload(BaseModel):
    ball: BallEvent
    win_prob: WinProbResult      # batting_prob, bowling_prob floats
    commentary: str
    alert: str | None
    timestamp: str               # ISO 8601 UTC
```

### 10.2 Database tables (SQLModel)

#### `BallEventLog`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `int` PK | Auto |
| `match_id` | `str` | Cricsheet filename stem |
| `inning` | `int` | 1 or 2 |
| `over` | `int` | 0-indexed |
| `ball` | `int` | 0-indexed |
| `batting_team` | `str` | |
| `bowling_team` | `str` | |
| `batter` | `str` | |
| `bowler` | `str` | |
| `total_runs` | `int` | |
| `is_wicket` | `bool` | |
| `player_dismissed` | `str?` | Nullable |
| `win_prob_batting` | `float` | 0–100 |
| `win_prob_bowling` | `float` | 0–100 |
| `commentary` | `str?` | LLM output |
| `alert` | `str?` | Milestone alert text |
| `timestamp` | `datetime` | `utcnow()` |

#### `LLMResponseLog`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `int` PK | Auto |
| `agent_name` | `str` | `"commentary"` or `"alerts"` |
| `prompt_summary` | `str` | First 100 chars of prompt |
| `response` | `str` | Full LLM response |
| `latency_ms` | `int` | Response time |
| `timestamp` | `datetime` | `utcnow()` |

---

## 11. API Specification

### Base URL

```
http://localhost:8000
```

### Endpoints

#### `GET /health`

Returns system health status.

**Response:**
```json
{
  "status": "ok",
  "redis": true,
  "db": true,
  "model_loaded": true
}
```

---

#### `GET /match/state`

Returns current live match state (in-memory, resets on server restart).

**Response:**
```json
{
  "match_id": "1529309",
  "inning": 1,
  "batting_team": "Gujarat Titans",
  "bowling_team": "Chennai Super Kings",
  "over": 7,
  "ball": 3,
  "runs_so_far": 62,
  "wickets_so_far": 1,
  "win_prob": { ... },
  "last_commentary": null
}
```

---

#### `GET /match/history`

Returns persisted ball log from PostgreSQL.

**Query params:** `limit` (int, 1–100, default 20)

**Response:**
```json
{
  "items": [
    {
      "over": 7,
      "ball": 3,
      "batting_team": "Gujarat Titans",
      "total_runs": 1,
      "is_wicket": false,
      "win_prob_batting": 64.2,
      "commentary": "Shubman Gill taps it away...",
      "timestamp": "2026-05-24T14:22:01"
    }
  ],
  "total": 127
}
```

---

#### `POST /match/event`

Manually inject any ball event into the pipeline. Used for testing and live demo injection.

**Body:** `BallEvent` JSON  
**Response:** `{"status": "ok", "event": { ... }}`

---

#### `POST /demo/wicket`

Injects a hardcoded Rohit Sharma caught dismissal. Fires the full agent pipeline. No body required.

**Response:** `{"status": "ok", "event": { ... }}`

---

#### `WS /ws`

WebSocket endpoint. Connect to receive live `WebSocketPayload` JSON on every ball.

**Message shape:**
```json
{
  "ball": { ... },
  "win_prob": {
    "batting_team": "Gujarat Titans",
    "bowling_team": "Chennai Super Kings",
    "batting_prob": 64.2,
    "bowling_prob": 35.8
  },
  "commentary": "Shubman Gill clips it fine...",
  "alert": null,
  "timestamp": "2026-05-24T14:22:01.123456Z"
}
```

---

## 12. Frontend Requirements

### 12.1 Technology

- **Vanilla JS** — no React, no Vue, no build step
- **Single HTML file** — `Frontend/index.html`
- **WebSocket API** — native browser `WebSocket`
- **CSS custom properties** — dark theme, no external CSS library

### 12.2 Layout

```
┌──────────────────────────────────────────────────────┐
│  CricketPulse ⚡                         ● Live       │
├──────────────────────────────────────────────────────┤
│           Gujarat Titans  vs  Chennai Super Kings    │
│         62/1          7.3          Innings 1          │
├──────────────────────────────────────────────────────┤
│  [WICKET ALERT BANNER — red, auto-hides 4s]          │
├──────────────────────────────────────────────────────┤
│  Win Probability          │  Ball Log                 │
│  GT  64.2%  ████░░  35.8% CSK │  ● 1 4 W 1 ● 6 ...   │
├──────────────────────────────────────────────────────┤
│  Live Commentary                                     │
│  › "Shubman Gill clips..."   14:22:01               │
│  › "Mukesh Choudhary..."     14:22:00               │
│  ...                                                 │
└──────────────────────────────────────────────────────┘
```

### 12.3 Reconnection

- On `ws.onclose` or `ws.onerror`: show "Disconnected — reconnecting..."
- Retry after 3000ms
- On reconnect: update dot to green, resume updates

---

## 13. Infrastructure & DevOps

### 13.1 Services (Docker Compose)

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| `redis` | `redis:alpine` | 6379 | Pub/sub message bus |
| `postgres` | `postgres:15-alpine` | 5432 | Ball event persistence |

### 13.2 Environment variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `GROQ_API_KEY` | Yes | — | Groq LLM API authentication |
| `REDIS_URL` | No | `redis://localhost:6379` | Redis connection string |
| `DATABASE_URL` | Yes | — | Async PostgreSQL DSN |
| `REDIS_CHANNEL` | No | `match:events` | Pub/sub channel name |

### 13.3 Process topology

```
Terminal 1:  uvicorn Backend.main:app --reload
Terminal 2:  python -m Backend.emitter.emitter --file match.json --speed demo
Docker:      docker compose up -d   (Redis + Postgres)
Browser:     open Frontend/index.html
```

### 13.4 Startup sequence

1. `docker compose up -d` — start Redis + Postgres
2. `uvicorn Backend.main:app` — FastAPI lifespan fires:
   - `load_model()` — XGBoost loads from disk
   - `create_db_tables()` — SQLModel creates tables if not exist
   - `redis.ping()` — connectivity verified
   - `subscribe_to_channel()` — background task starts
3. Browser opens `Frontend/index.html` — WS connects
4. `emitter.py` starts — first ball published to Redis → full pipeline fires

---

## 14. Security

### 14.1 Secrets management

- All secrets in `.env` — excluded from git via `.gitignore`
- `pydantic-settings` reads `.env` on startup — no `os.environ` calls scattered in code
- No secrets in source files, logs, or error messages

### 14.2 Input validation

- All inbound data (REST and Redis) validated through Pydantic v2 schemas before processing
- `POST /match/event` body is validated as `BallEvent` — malformed payloads rejected at schema layer

### 14.3 CORS

- All origins allowed (`*`) — appropriate for hackathon/demo context
- **Production note:** restrict to specific frontend origin before shipping

### 14.4 WebSocket

- No authentication on `/ws` — any client can connect
- **Production note:** add token-based WS auth before production deployment

---

## 15. Out of Scope

The following are explicitly not in scope for v1.0:

| Item | Reason |
|------|--------|
| Live match data ingestion (official API) | Cricsheet JSON replay sufficient for demo |
| User authentication | Not required for hackathon demo |
| Multiple concurrent match support | Single match state in memory |
| Mobile-responsive frontend beyond basics | Not a UI hackathon |
| Ball-by-ball video synchronization | Infrastructure not available |
| Full LLM response logging via `LLMResponseLog` | Table defined, writes not yet wired |
| Player statistics beyond cumulative run totals | Out of feature scope |
| DLS method / reduced-over scenarios | Cricsheet data used is full-match only |

---

## 16. Glossary

| Term | Definition |
|------|------------|
| **Ball event** | A single delivery in a cricket match — the atomic unit of this system |
| **Cumulative state** | In-memory running totals (runs, wickets, ball number) that reset on innings transition |
| **Cricsheet** | Open-source cricket data project providing JSON ball-by-ball match files |
| **Innings transition** | The moment inning 1 ends and inning 2 begins; target is set, cumulative state resets |
| **Match state** | The 12-feature vector fed to the XGBoost model, derived from cumulative + event |
| **asyncio.gather()** | Python concurrency primitive — runs coroutines concurrently in the same event loop |
| **asyncio.to_thread()** | Runs synchronous (CPU-bound) code in a thread pool without blocking the event loop |
| **Pub/sub** | Redis publish/subscribe pattern — emitter publishes, backend subscribes |
| **WebSocketPayload** | The canonical output schema broadcast to frontend clients per ball |
| **Fire-and-forget** | `asyncio.create_task()` pattern for DB logging — dispatched but not awaited |
| **LabelEncoder** | Sklearn encoder mapping team names to integer indices for ML input |
| **Powerplay** | First 6 overs of an innings (over < 6), fielding restrictions apply |

---

*CricketPulse — Built at GDG Raipur, Agentic Premier League Hackathon, May 24 2026*
