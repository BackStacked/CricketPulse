export const DEVELOPER_INFO = {
  name: 'Himanshu Singh',
  title: 'Backend Developer · ML Engineer · Blockchain Enthusiast',
  college: 'Pragati College, Raipur',
  email: 'backstackeddev@gmail.com',
  github: 'BackStacked',
  githubUrl: 'https://github.com/BackStacked',
  initials: 'HS',
  skills: [
    'Python', 'FastAPI', 'XGBoost', 'Redis',
    'WebSockets', 'PostgreSQL', 'Docker', 'TypeScript', 'Solana', 'EVM',
  ],
  specialty:
    'Built CricketPulse solo in 3.5 hours — real ML pipeline (81.7% accuracy), multi-agent async backend, real-time WebSocket delivery, and full documentation.',
}

export const PROJECT_INFO = {
  name: 'CricketPulse',
  description:
    'Real-time multi-agent IPL intelligence platform. XGBoost win probability, LLM commentary, and autonomous alerts on every ball.',
  event: 'GDG Raipur · Agentic Premier League',
  date: 'May 24, 2026',
  buildWindow: '3.5 hours',
  repoUrl: 'https://github.com/BackStacked/CricketPulse',
}

export const MODEL_METRICS = {
  accuracy: '81.7%',
  roc_auc: '0.91',
  log_loss: '0.397',
  trainingSamples: '260,430',
  inferenceTime: '< 1ms',
}

export interface TechItem {
  name: string
  category: string
  description: string
  accent: string
}

export const TECH_STACK: TechItem[] = [
  { name: 'FastAPI', category: 'API Framework', description: 'Async native, WebSocket built-in', accent: 'border-accent-primary' },
  { name: 'Redis', category: 'Message Bus', description: 'Pub/sub fan-out, zero latency', accent: 'border-accent-red' },
  { name: 'XGBoost', category: 'ML Model', description: '81.7% accuracy, < 1ms inference', accent: 'border-accent-purple' },
  { name: 'Groq LLM', category: 'Commentary AI', description: 'llama-3.1-8b-instant, ~300ms', accent: 'border-accent-primary' },
  { name: 'PostgreSQL', category: 'Database', description: 'Event log + LLM audit trail', accent: 'border-accent-secondary' },
  { name: 'WebSockets', category: 'Real-time', description: 'Live push to all clients', accent: 'border-accent-amber' },
  { name: 'Docker', category: 'Containers', description: 'One-command setup', accent: 'border-accent-amber' },
  { name: 'Next.js 16', category: 'Dashboard', description: 'App Router, TypeScript', accent: 'border-accent-green' },
]

export interface MLFeature {
  name: string
  type: string
  description: string
  importance: number
}

export const FEATURE_TABLE: MLFeature[] = [
  { name: 'required_rr', type: 'float', description: 'Runs needed per over (2nd innings)', importance: 25.3 },
  { name: 'wickets_so_far', type: 'int', description: 'Wickets fallen so far', importance: 11.8 },
  { name: 'runs_remaining', type: 'int', description: 'Runs still needed (2nd innings)', importance: 9.6 },
  { name: 'target', type: 'int', description: '2nd innings target score', importance: 9.0 },
  { name: 'inning', type: 'int', description: '1st or 2nd innings', importance: 7.7 },
  { name: 'current_rr', type: 'float', description: 'Current run rate', importance: 7.3 },
  { name: 'runs_so_far', type: 'int', description: 'Cumulative runs this innings', importance: 7.0 },
  { name: 'batting_team_enc', type: 'int', description: 'Label-encoded batting team', importance: 6.7 },
  { name: 'bowling_team_enc', type: 'int', description: 'Label-encoded bowling team', importance: 6.6 },
  { name: 'balls_remaining', type: 'int', description: 'Balls left in innings', importance: 4.0 },
  { name: 'over', type: 'int', description: 'Current over number (0-19)', importance: 4.0 },
  { name: 'ball', type: 'int', description: 'Ball within over (0-5)', importance: 0.8 },
]

export interface Endpoint {
  method: 'GET' | 'POST' | 'WS'
  path: string
  description: string
  body?: string
  response: string
}

export const API_ENDPOINTS: Endpoint[] = [
  {
    method: 'GET',
    path: '/health',
    description: 'Service health check. Shows Redis, DB, and ML model status.',
    response: '{ "status": "ok", "redis": true, "db": true, "model_loaded": true }',
  },
  {
    method: 'WS',
    path: '/ws',
    description: 'WebSocket endpoint. Connect to receive live ball-by-ball payloads.',
    response: '{ "ball": {...}, "win_prob": {...}, "commentary": "...", "alert": null, "timestamp": "..." }',
  },
  {
    method: 'GET',
    path: '/match/state',
    description: 'Current match snapshot — score, overs, win probability, last commentary.',
    response: '{ "match_id": "...", "inning": 1, "batting_team": "...", "runs_so_far": 87, ... }',
  },
  {
    method: 'GET',
    path: '/match/history?limit=20',
    description: 'Last N balls from Postgres with LLM responses and probabilities.',
    response: '{ "items": [...], "total": 127 }',
  },
  {
    method: 'POST',
    path: '/match/event',
    description: 'Manually inject any ball event. Use during demo to trigger a wicket instantly.',
    body: '{ "match_id": "demo", "inning": 1, "batting_team": "...", "is_wicket": true, ... }',
    response: '{ "status": "ok", "event": {...} }',
  },
  {
    method: 'POST',
    path: '/demo/wicket',
    description: 'Fires a pre-configured Rohit Sharma wicket event. One click, guaranteed drama.',
    response: '{ "status": "ok", "event": {...} }',
  },
]

export interface Sprint {
  number: number
  title: string
  time: string
  color: string
  tasks: string[]
  doneWhen: string
}

export const SPRINT_PLAN: Sprint[] = [
  {
    number: 1,
    title: 'Foundation',
    time: '3:30–4:30 PM',
    color: 'border-accent-green',
    tasks: [
      'FastAPI app scaffold + config.py with pydantic-settings',
      'Redis pub/sub core module',
      'WebSocket connection manager',
      'BallEvent Pydantic schema',
      'Docker Compose: Redis + Postgres up',
    ],
    doneWhen: 'Browser receives raw JSON from /ws',
  },
  {
    number: 2,
    title: 'Core Features',
    time: '4:30–5:30 PM',
    color: 'border-accent-primary',
    tasks: [
      'XGBoost model training on Cricsheet data',
      'Win probability agent with asyncio.to_thread()',
      'Groq LLM commentary agent with fallback',
      'Alerts agent — rule engine + conditional LLM',
      'asyncio.gather() parallel execution in event_processor',
      'SQLModel DB logging as fire-and-forget task',
    ],
    doneWhen: 'Win probability gauge moves on every ball delivered',
  },
  {
    number: 3,
    title: 'Polish + Demo',
    time: '5:30–7:00 PM',
    color: 'border-accent-amber',
    tasks: [
      'Cricsheet emitter.py with CLI speed control',
      'Frontend Next.js dashboard with real WebSocket',
      'Framer Motion animations (wicket, six, four, milestone)',
      'POST /demo/wicket for judge-friendly instant drama',
      'Full README + PRD documentation',
      'End-to-end integration test with all 7 checks',
    ],
    doneWhen: 'Ready for judges at 7:00 PM',
  },
]

export interface DemoSection {
  timestamp: string
  title: string
  content: string
  highlight?: boolean
  badge?: string
}

export const DEMO_SCRIPT: DemoSection[] = [
  {
    timestamp: '0:00–0:20',
    title: 'Hook',
    content:
      '"Cricket is the only sport where 1.4 billion people feel the same 3 seconds of gut-wrenching tension — the pause between a bowler\'s run-up and the ball hitting the bat. We built an AI system that lives in that moment."',
  },
  {
    timestamp: '0:20–0:45',
    title: 'Architecture',
    content:
      'Three agents run in parallel on every single ball: a custom XGBoost model predicts win probability, a Groq LLM writes live commentary grounded in real statistics, and a rule-engine fires alerts on wickets, fifties, centuries, and sixes.',
  },
  {
    timestamp: '0:45–1:30',
    title: 'Live Demo',
    content:
      'Open the dashboard. Watch the win probability shift on every delivery. See commentary appear in real time. Now — POST /demo/wicket. Watch the red animation fire. This is every ball of every IPL match, automated.',
    highlight: true,
    badge: 'MONEY MOMENT',
  },
  {
    timestamp: '1:30–2:00',
    title: 'Technical Flex',
    content:
      '"This probability comes from a model I trained on 10 years of IPL data — 260,000 ball-level samples, 12 features, 81.7% accuracy, 0.91 AUC-ROC. It runs in under a millisecond. The LLM commentary is grounded in that probability — so it\'s not hallucinating, it knows the actual pressure."',
  },
  {
    timestamp: '2:00–2:30',
    title: 'So What',
    content:
      'This is the infrastructure for the next generation of cricket media. Any broadcaster, any analyst, any app can subscribe to this WebSocket and get AI commentary and win probability on every ball, with sub-second latency.',
  },
  {
    timestamp: '2:30–3:00',
    title: 'Close',
    content: '"Cricket is real-time. AI should be too."',
  },
]

export interface QA {
  question: string
  answer: string
}

export const JUDGE_QUESTIONS: QA[] = [
  {
    question: 'How accurate is the win probability model?',
    answer:
      '81.7% accuracy, 0.91 AUC-ROC, trained on 260,430 IPL ball-level samples. The model uses 12 features including required run rate, wickets, balls remaining, and both team encodings. It runs in under 1ms using joblib/XGBoost.',
  },
  {
    question: 'What happens if the Groq API goes down?',
    answer:
      'Every LLM call is wrapped in try/except with a "Great delivery!" fallback. The broadcast pipeline never crashes — the LLM is a best-effort enhancement, not a dependency.',
  },
  {
    question: 'How does the multi-agent parallel execution work?',
    answer:
      'asyncio.gather() runs the win probability agent and alerts agent concurrently. The win prob agent uses asyncio.to_thread() because XGBoost is CPU-bound. Commentary fires after gather() since it needs the win prob context. Total end-to-end: under 1 second on a normal Groq response.',
  },
  {
    question: 'Could this scale to multiple concurrent matches?',
    answer:
      'Yes with two changes: replace the in-memory cumulative dict with a Redis hash keyed by match_id, and add a match_id prefix to the WebSocket broadcast channel. The agent architecture is stateless by design.',
  },
  {
    question: 'Why XGBoost over a neural network?',
    answer:
      'Tabular data with 12 hand-engineered features. XGBoost dominates here — interpretable, fast, no GPU needed, sub-millisecond inference. A neural network would be slower and harder to explain to a judge in 3 minutes.',
  },
]

export interface Goal {
  id: string
  priority: 'P0' | 'P1' | 'P2'
  description: string
  metric: string
}

export const PRD_GOALS: Goal[] = [
  { id: 'G1', priority: 'P0', description: 'Process every ball event end-to-end in under 3 seconds', metric: 'p95 latency < 3s' },
  { id: 'G2', priority: 'P0', description: 'Win probability updates on every single delivery', metric: 'Zero missed events' },
  { id: 'G3', priority: 'P0', description: 'LLM failure never crashes pipeline — always fallback', metric: '0 unhandled exceptions' },
  { id: 'G4', priority: 'P0', description: 'Dead WebSocket client never affects healthy ones', metric: 'Per-client fault isolation' },
  { id: 'G5', priority: 'P1', description: 'All ball events persisted without blocking broadcast', metric: 'asyncio.create_task()' },
  { id: 'G6', priority: 'P1', description: 'Frontend reflects live state with zero page refresh', metric: 'WebSocket push' },
  { id: 'G7', priority: 'P1', description: 'Replay any Cricsheet IPL JSON match via emitter', metric: 'All 10 IPL teams supported' },
  { id: 'G8', priority: 'P2', description: 'Documentation site fully readable without backend', metric: 'Static content' },
]
