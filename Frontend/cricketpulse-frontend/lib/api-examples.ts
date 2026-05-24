export type Language = 'curl' | 'python' | 'typescript' | 'go' | 'rust'

export const LANGUAGES: { id: Language; label: string }[] = [
  { id: 'curl',       label: 'cURL'       },
  { id: 'python',     label: 'Python'     },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'go',         label: 'Go'         },
  { id: 'rust',       label: 'Rust'       },
]

// Parallel to API_ENDPOINTS array in constants.ts
export const API_EXAMPLES: Record<Language, string>[] = [
  // ── GET /health ──────────────────────────────────────────────────────────
  {
    curl: `curl http://localhost:8000/health`,

    python: `import requests

r = requests.get("http://localhost:8000/health")
print(r.json())
# {'status': 'ok', 'redis': True, 'db': True, 'model_loaded': True}`,

    typescript: `const res = await fetch("http://localhost:8000/health")
const health = await res.json()
console.log(health)
// { status: 'ok', redis: true, db: true, model_loaded: true }`,

    go: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	resp, err := http.Get("http://localhost:8000/health")
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	var data map[string]any
	json.NewDecoder(resp.Body).Decode(&data)
	fmt.Println(data)
}`,

    rust: `// Cargo.toml: reqwest = { features = ["json"] }, tokio = { features = ["full"] }
#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    let data: serde_json::Value =
        reqwest::get("http://localhost:8000/health")
            .await?
            .json()
            .await?;
    println!("{:#?}", data);
    Ok(())
}`,
  },

  // ── WS /ws ───────────────────────────────────────────────────────────────
  {
    curl: `# Install wscat: npm install -g wscat
wscat -c ws://localhost:8000/ws

# Each message is a live JSON payload:
# {
#   "ball": { "over": 14, "ball": 3, "batter": "Rohit Sharma", ... },
#   "win_prob": { "batting_prob": 62.3, "bowling_prob": 37.7 },
#   "commentary": "Bumrah steams in — Rohit is at 62% to win this.",
#   "alert": null,
#   "timestamp": "2026-05-24T18:30:00Z"
# }`,

    python: `import asyncio
import json
import websockets  # pip install websockets

async def listen():
    uri = "ws://localhost:8000/ws"
    async with websockets.connect(uri) as ws:
        async for message in ws:
            data = json.loads(message)
            ball = data["ball"]
            win  = data["win_prob"]
            print(
                f"{ball['over']}.{ball['ball']} | "
                f"Win: {win['batting_prob']}% | "
                f"{data['commentary']}"
            )
            if data["alert"]:
                print(f"  🚨 {data['alert']}")

asyncio.run(listen())`,

    typescript: `const ws = new WebSocket("ws://localhost:8000/ws")

ws.onopen = () => console.log("Connected to CricketPulse")

ws.onmessage = (event: MessageEvent) => {
  const data = JSON.parse(event.data as string)
  const { ball, win_prob, commentary, alert } = data

  console.log(
    \`\${ball.over}.\${ball.ball} | Win: \${win_prob.batting_prob}% | \${commentary}\`
  )
  if (alert) console.warn("Alert:", alert)
}

ws.onerror  = () => ws.close()
ws.onclose  = () => setTimeout(() => location.reload(), 3000) // reconnect`,

    go: `package main

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/gorilla/websocket" // go get github.com/gorilla/websocket
)

func main() {
	conn, _, err := websocket.DefaultDialer.Dial(
		"ws://localhost:8000/ws", nil,
	)
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			break
		}
		var data map[string]any
		json.Unmarshal(msg, &data)
		fmt.Println(data["commentary"])
	}
}`,

    rust: `// Cargo.toml: tokio-tungstenite, futures-util, serde_json, tokio
use futures_util::StreamExt;
use serde_json::Value;
use tokio_tungstenite::connect_async;

#[tokio::main]
async fn main() {
    let (ws, _) = connect_async("ws://localhost:8000/ws")
        .await
        .expect("connect failed");

    let (_, mut read) = ws.split();

    while let Some(Ok(msg)) = read.next().await {
        if let Ok(data) = serde_json::from_str::<Value>(msg.to_text().unwrap()) {
            println!("{}", data["commentary"]);
            if !data["alert"].is_null() {
                eprintln!("Alert: {}", data["alert"]);
            }
        }
    }
}`,
  },

  // ── GET /match/state ─────────────────────────────────────────────────────
  {
    curl: `curl http://localhost:8000/match/state`,

    python: `import requests

state = requests.get("http://localhost:8000/match/state").json()
print(f"Score : {state['runs_so_far']}/{state['wickets_so_far']}")
print(f"Overs : {state['current_over']}.{state['current_ball']}")
print(f"Win % : {state['win_prob']['batting_prob']}%")`,

    typescript: `const res   = await fetch("http://localhost:8000/match/state")
const state = await res.json()

console.log(\`Score : \${state.runs_so_far}/\${state.wickets_so_far}\`)
console.log(\`Overs : \${state.current_over}.\${state.current_ball}\`)
console.log(\`Win % : \${state.win_prob?.batting_prob}%\`)`,

    go: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	resp, _ := http.Get("http://localhost:8000/match/state")
	defer resp.Body.Close()

	var state map[string]any
	json.NewDecoder(resp.Body).Decode(&state)
	fmt.Printf(
		"Score: %v/%v  Win: %v%%\n",
		state["runs_so_far"],
		state["wickets_so_far"],
		state["win_prob"],
	)
}`,

    rust: `#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    let state: serde_json::Value =
        reqwest::get("http://localhost:8000/match/state")
            .await?
            .json()
            .await?;

    println!(
        "Score: {}/{} | Win: {}%",
        state["runs_so_far"],
        state["wickets_so_far"],
        state["win_prob"]["batting_prob"],
    );
    Ok(())
}`,
  },

  // ── GET /match/history?limit=20 ──────────────────────────────────────────
  {
    curl: `# Last 20 balls (default)
curl "http://localhost:8000/match/history?limit=20"

# Last 5 balls
curl "http://localhost:8000/match/history?limit=5"`,

    python: `import requests

r = requests.get(
    "http://localhost:8000/match/history",
    params={"limit": 20},
)
history = r.json()
print(f"Showing {len(history['items'])} of {history['total']} balls")

for ball in history["items"]:
    print(f"  {ball['over']}.{ball['ball']}: {ball['commentary']}")`,

    typescript: `const res = await fetch("http://localhost:8000/match/history?limit=20")
const { items, total } = await res.json()

console.log(\`Showing \${items.length} of \${total} balls\`)

for (const ball of items) {
  console.log(\`  \${ball.over}.\${ball.ball}: \${ball.commentary}\`)
}`,

    go: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type Ball struct {
	Over      int    \`json:"over"\`
	Ball      int    \`json:"ball"\`
	Commentary string \`json:"commentary"\`
}

type History struct {
	Items []Ball \`json:"items"\`
	Total int    \`json:"total"\`
}

func main() {
	resp, _ := http.Get("http://localhost:8000/match/history?limit=20")
	defer resp.Body.Close()

	var h History
	json.NewDecoder(resp.Body).Decode(&h)
	fmt.Printf("Total: %d\n", h.Total)
	for _, b := range h.Items {
		fmt.Printf("  %d.%d: %s\n", b.Over, b.Ball, b.Commentary)
	}
}`,

    rust: `#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    let data: serde_json::Value =
        reqwest::get("http://localhost:8000/match/history?limit=20")
            .await?
            .json()
            .await?;

    let total = &data["total"];
    println!("Total: {total}");

    if let Some(items) = data["items"].as_array() {
        for item in items {
            println!(
                "  {}.{}: {}",
                item["over"], item["ball"], item["commentary"]
            );
        }
    }
    Ok(())
}`,
  },

  // ── POST /match/event ─────────────────────────────────────────────────────
  {
    curl: `curl -X POST http://localhost:8000/match/event \\
  -H "Content-Type: application/json" \\
  -d '{
    "match_id": "demo",
    "inning": 1,
    "batting_team": "Mumbai Indians",
    "bowling_team": "Kolkata Knight Riders",
    "over": 14, "ball": 3,
    "batter": "Rohit Sharma",
    "bowler": "Jasprit Bumrah",
    "non_striker": "Ishan Kishan",
    "batsman_runs": 0, "extra_runs": 0, "total_runs": 0,
    "is_wicket": true,
    "player_dismissed": "Rohit Sharma",
    "dismissal_kind": "caught",
    "is_powerplay": false
  }'`,

    python: `import requests

payload = {
    "match_id": "demo",
    "inning": 1,
    "batting_team": "Mumbai Indians",
    "bowling_team": "Kolkata Knight Riders",
    "over": 14, "ball": 3,
    "batter": "Rohit Sharma",
    "bowler": "Jasprit Bumrah",
    "non_striker": "Ishan Kishan",
    "batsman_runs": 0, "extra_runs": 0, "total_runs": 0,
    "is_wicket": True,
    "player_dismissed": "Rohit Sharma",
    "dismissal_kind": "caught",
    "is_powerplay": False,
}

r = requests.post("http://localhost:8000/match/event", json=payload)
print(r.json())`,

    typescript: `const payload = {
  match_id: "demo",
  inning: 1,
  batting_team: "Mumbai Indians",
  bowling_team: "Kolkata Knight Riders",
  over: 14, ball: 3,
  batter: "Rohit Sharma",
  bowler: "Jasprit Bumrah",
  non_striker: "Ishan Kishan",
  batsman_runs: 0, extra_runs: 0, total_runs: 0,
  is_wicket: true,
  player_dismissed: "Rohit Sharma",
  dismissal_kind: "caught",
  is_powerplay: false,
}

const res = await fetch("http://localhost:8000/match/event", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
})
console.log(await res.json())`,

    go: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	payload := map[string]any{
		"match_id":         "demo",
		"inning":           1,
		"batting_team":     "Mumbai Indians",
		"bowling_team":     "Kolkata Knight Riders",
		"over": 14, "ball": 3,
		"batter":           "Rohit Sharma",
		"bowler":           "Jasprit Bumrah",
		"non_striker":      "Ishan Kishan",
		"batsman_runs": 0, "extra_runs": 0, "total_runs": 0,
		"is_wicket":        true,
		"player_dismissed": "Rohit Sharma",
		"dismissal_kind":   "caught",
		"is_powerplay":     false,
	}

	body, _ := json.Marshal(payload)
	resp, _ := http.Post(
		"http://localhost:8000/match/event",
		"application/json",
		bytes.NewReader(body),
	)
	defer resp.Body.Close()

	var result map[string]any
	json.NewDecoder(resp.Body).Decode(&result)
	fmt.Println(result)
}`,

    rust: `// Cargo.toml: reqwest = { features = ["json"] }, serde_json, tokio
use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    let result = reqwest::Client::new()
        .post("http://localhost:8000/match/event")
        .json(&json!({
            "match_id": "demo", "inning": 1,
            "batting_team": "Mumbai Indians",
            "bowling_team": "Kolkata Knight Riders",
            "over": 14, "ball": 3,
            "batter": "Rohit Sharma",
            "bowler": "Jasprit Bumrah",
            "non_striker": "Ishan Kishan",
            "batsman_runs": 0, "extra_runs": 0, "total_runs": 0,
            "is_wicket": true,
            "player_dismissed": "Rohit Sharma",
            "dismissal_kind": "caught",
            "is_powerplay": false
        }))
        .send()
        .await?
        .json::<serde_json::Value>()
        .await?;

    println!("{:#?}", result);
    Ok(())
}`,
  },

  // ── POST /demo/wicket ─────────────────────────────────────────────────────
  {
    curl: `# Fires a pre-configured Rohit Sharma wicket — no body needed
curl -X POST http://localhost:8000/demo/wicket`,

    python: `import requests

# One click — guaranteed drama
r = requests.post("http://localhost:8000/demo/wicket")
print(r.json())
# Triggers: Rohit Sharma caught out at 14.3`,

    typescript: `// One click — guaranteed drama
const res = await fetch("http://localhost:8000/demo/wicket", {
  method: "POST",
})
const data = await res.json()
console.log(data)
// { status: 'ok', event: { is_wicket: true, player_dismissed: 'Rohit Sharma', ... } }`,

    go: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	// No body required — endpoint fires a pre-configured wicket event
	resp, err := http.Post(
		"http://localhost:8000/demo/wicket",
		"application/json", nil,
	)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	var result map[string]any
	json.NewDecoder(resp.Body).Decode(&result)
	fmt.Println(result)
}`,

    rust: `#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    // No body required — endpoint fires a pre-configured wicket event
    let result = reqwest::Client::new()
        .post("http://localhost:8000/demo/wicket")
        .send()
        .await?
        .json::<serde_json::Value>()
        .await?;

    println!("{:#?}", result);
    Ok(())
}`,
  },
]
