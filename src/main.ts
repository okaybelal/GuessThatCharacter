import "./style.css";
import { characters, attributeLabels, type Character } from "./characters";
import { avatarSVG } from "./avatar";

type AttrKey = keyof Character["attributes"];
type Team = "Red" | "Blue";

interface PublicPlayer {
  id: string;
  name: string;
  team: Team;
}

interface LogEntry {
  team: Team;
  playerName: string;
  kind: "question" | "guess";
  key?: string;
  characterId?: string;
  result: string;
}

interface RoomState {
  code: string;
  status: "lobby" | "playing" | "finished";
  players: PublicPlayer[];
  eliminated: string[];
  turnTeam: Team;
  log: LogEntry[];
  winner?: Team;
  secretName?: string;
  secretSource?: string;
}

const app = document.querySelector<HTMLDivElement>("#app")!;

let myPlayerId: string | null = null;
let room: RoomState | null = null;
let errorMsg = "";
let playerName = localStorage.getItem("gtc-name") || "";
let pollTimer: ReturnType<typeof setInterval> | null = null;

async function api(path: string, method: string, body?: unknown) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

function startPolling(code: string) {
  stopPolling();
  pollTimer = setInterval(async () => {
    try {
      const data = await api(`/rooms/${code}`, "GET");
      room = data.room;
      render();
    } catch {
      stopPolling();
      room = null;
      myPlayerId = null;
      errorMsg = "Room no longer available.";
      render();
    }
  }, 1500);
}

async function createRoom() {
  if (!playerName.trim()) return;
  localStorage.setItem("gtc-name", playerName);
  try {
    const data = await api("/rooms", "POST", { name: playerName });
    myPlayerId = data.playerId;
    room = data.room;
    errorMsg = "";
    startPolling(room!.code);
    render();
  } catch (e: any) {
    errorMsg = e.message;
    render();
  }
}

async function joinRoom(code: string) {
  const trimmed = code.trim().toUpperCase();
  if (!playerName.trim() || !trimmed) return;
  localStorage.setItem("gtc-name", playerName);
  try {
    const data = await api(`/rooms/${trimmed}/join`, "POST", { name: playerName });
    myPlayerId = data.playerId;
    room = data.room;
    errorMsg = "";
    startPolling(room!.code);
    render();
  } catch (e: any) {
    errorMsg = e.message;
    render();
  }
}

async function switchTeam(team: Team) {
  if (!room || !myPlayerId) return;
  try {
    const data = await api(`/rooms/${room.code}/team`, "POST", { playerId: myPlayerId, team });
    room = data.room;
    render();
  } catch (e: any) {
    errorMsg = e.message;
    render();
  }
}

async function startGame() {
  if (!room || !myPlayerId) return;
  try {
    const data = await api(`/rooms/${room.code}/start`, "POST", { playerId: myPlayerId });
    room = data.room;
    errorMsg = "";
    render();
  } catch (e: any) {
    errorMsg = e.message;
    render();
  }
}

async function askQuestion(key: AttrKey) {
  if (!room || !myPlayerId) return;
  try {
    const data = await api(`/rooms/${room.code}/question`, "POST", { playerId: myPlayerId, key });
    room = data.room;
    render();
  } catch (e: any) {
    errorMsg = e.message;
    render();
  }
}

async function makeGuess(characterId: string) {
  if (!room || !myPlayerId) return;
  try {
    const data = await api(`/rooms/${room.code}/guess`, "POST", { playerId: myPlayerId, characterId });
    room = data.room;
    render();
  } catch (e: any) {
    errorMsg = e.message;
    render();
  }
}

async function leaveRoom() {
  if (room && myPlayerId) {
    try {
      await api(`/rooms/${room.code}/leave`, "POST", { playerId: myPlayerId });
    } catch {
      // room may already be gone; leaving locally regardless
    }
  }
  stopPolling();
  room = null;
  myPlayerId = null;
  render();
}

function myTeam(): Team | null {
  if (!room || !myPlayerId) return null;
  return room.players.find((p) => p.id === myPlayerId)?.team ?? null;
}

function render() {
  if (!room) {
    document.body.removeAttribute("data-turn");
    renderLobby();
  } else if (room.status === "lobby") {
    document.body.removeAttribute("data-turn");
    renderWaitingRoom();
  } else if (room.status === "finished") {
    document.body.setAttribute("data-turn", room.winner === "Blue" ? "blue" : "red");
    renderGame();
  } else {
    document.body.setAttribute("data-turn", room.turnTeam === "Blue" ? "blue" : "red");
    renderGame();
  }
}

function renderLobby() {
  app.innerHTML = `
    <div class="game lobby">
      <header>
        <h1>🎭 Guess That Character</h1>
        <p class="subtitle">Play solo vs. solo or team up with friends — Red vs. Blue take turns asking yes/no questions to find the secret character first.</p>
      </header>

      <section class="panel">
        <label class="field">
          <span>Your name</span>
          <input id="name-input" type="text" maxlength="20" value="${playerName}" placeholder="Enter your name" />
        </label>

        <div class="lobby-actions">
          <div class="create-block">
            <h2>Create a Room</h2>
            <button id="create-room" class="mode-btn wide">Create Room</button>
          </div>
          <div class="divider">or</div>
          <div class="join-block">
            <h2>Join a Room</h2>
            <div class="join-row">
              <input id="code-input" type="text" maxlength="5" placeholder="ROOM CODE" />
              <button id="join-btn" class="mode-btn">Join</button>
            </div>
          </div>
        </div>
        ${errorMsg ? `<p class="error">${errorMsg}</p>` : ""}
      </section>
    </div>
  `;

  const nameInput = document.querySelector<HTMLInputElement>("#name-input")!;
  nameInput.addEventListener("input", () => (playerName = nameInput.value));

  document.querySelector<HTMLButtonElement>("#create-room")!.addEventListener("click", () => createRoom());
  document.querySelector<HTMLButtonElement>("#join-btn")!.addEventListener("click", () => {
    const code = document.querySelector<HTMLInputElement>("#code-input")!.value;
    joinRoom(code);
  });
}

function renderWaitingRoom() {
  const r = room!;
  const teamRed = r.players.filter((p) => p.team === "Red");
  const teamBlue = r.players.filter((p) => p.team === "Blue");
  const ready = teamRed.length >= 1 && teamBlue.length >= 1;
  const my = myTeam();

  app.innerHTML = `
    <div class="game lobby">
      <header>
        <h1>🎭 Guess That Character</h1>
        <p class="subtitle">Waiting room · Teams can be any size</p>
      </header>

      <section class="panel">
        <p class="room-code">Room Code: <strong>${r.code}</strong></p>
        <p class="hint">Share this code with your friends so they can join. Anyone can switch teams before the game starts.</p>

        <div class="teams-preview">
          <div class="team-col team-red">
            <h2>🔴 Team Red (${teamRed.length})</h2>
            <ul>${teamRed.map((p) => `<li>${p.name}${p.id === myPlayerId ? " (you)" : ""}</li>`).join("") || "<li class='empty'>Empty</li>"}</ul>
            ${my !== "Red" ? `<button class="switch-btn" data-team="Red">Join Red</button>` : ""}
          </div>
          <div class="team-col team-blue">
            <h2>🔵 Team Blue (${teamBlue.length})</h2>
            <ul>${teamBlue.map((p) => `<li>${p.name}${p.id === myPlayerId ? " (you)" : ""}</li>`).join("") || "<li class='empty'>Empty</li>"}</ul>
            ${my !== "Blue" ? `<button class="switch-btn" data-team="Blue">Join Blue</button>` : ""}
          </div>
        </div>

        <button id="start-btn" class="restart" ${ready ? "" : "disabled"}>${ready ? "▶️ Start Game" : "Need at least 1 player on each team"}</button>
        <button id="leave-btn" class="leave">Leave Room</button>
        ${errorMsg ? `<p class="error">${errorMsg}</p>` : ""}
      </section>
    </div>
  `;

  document.querySelector<HTMLButtonElement>("#start-btn")!.addEventListener("click", startGame);
  document.querySelector<HTMLButtonElement>("#leave-btn")!.addEventListener("click", leaveRoom);
  document.querySelectorAll<HTMLButtonElement>(".switch-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchTeam(btn.dataset.team as Team));
  });
}

function renderGame() {
  const r = room!;
  const team = myTeam();
  const isMyTurn = team === r.turnTeam;
  const finished = r.status === "finished";

  app.innerHTML = `
    <div class="game">
      <header>
        <h1>🎭 Guess That Character</h1>
        <p class="subtitle">Room ${r.code}</p>
        ${
          finished
            ? `<p class="counter winner-banner">🏆 Team ${r.winner} wins! It was <strong>${r.secretName}</strong> (${r.secretSource})</p>`
            : `<p class="counter">${isMyTurn ? "🟢 Your team's turn!" : `⏳ Waiting on Team ${r.turnTeam}`}</p>`
        }
      </header>

      <section class="teams-bar">
        <div class="team-chip team-red ${r.turnTeam === "Red" ? "active" : ""}">🔴 Red: ${r.players.filter((p) => p.team === "Red").map((p) => p.name).join(", ") || "—"}</div>
        <div class="team-chip team-blue ${r.turnTeam === "Blue" ? "active" : ""}">🔵 Blue: ${r.players.filter((p) => p.team === "Blue").map((p) => p.name).join(", ") || "—"}</div>
      </section>

      <section class="questions">
        <h2>Ask a Question ${team ? `(Team ${team})` : ""}</h2>
        <div class="question-grid">
          ${Object.entries(attributeLabels)
            .map(([key, label]) => `<button class="q-btn" data-key="${key}" ${isMyTurn && !finished ? "" : "disabled"}>${label}</button>`)
            .join("")}
        </div>
        <div class="log">
          ${r.log
            .slice()
            .reverse()
            .slice(0, 8)
            .map((entry) => {
              if (entry.kind === "question") {
                return `<div class="log-entry">Team ${entry.team} · ${entry.playerName}: "${attributeLabels[entry.key as AttrKey]}" → <strong>${entry.result}</strong></div>`;
              }
              const c = characters.find((ch) => ch.id === entry.characterId);
              return `<div class="log-entry">Team ${entry.team} · ${entry.playerName} guessed <strong>${c?.name}</strong> → <strong>${entry.result}</strong></div>`;
            })
            .join("")}
        </div>
      </section>

      <section class="board">
        <h2>Characters</h2>
        <div class="grid">
          ${characters
            .map((c) => {
              const isOut = r.eliminated.includes(c.id);
              const disabled = isOut || !isMyTurn || finished;
              return `
              <button class="card ${isOut ? "eliminated" : ""}" data-id="${c.id}" ${disabled ? "disabled" : ""}>
                <span class="avatar">${avatarSVG(c)}</span>
                <span class="name">${c.name}</span>
                <span class="source">${c.source}</span>
              </button>`;
            })
            .join("")}
        </div>
      </section>

      <button id="leave-btn" class="leave">Leave Room</button>
    </div>
  `;

  document.querySelectorAll<HTMLButtonElement>(".q-btn").forEach((btn) => {
    btn.addEventListener("click", () => askQuestion(btn.dataset.key as AttrKey));
  });
  document.querySelectorAll<HTMLButtonElement>(".card").forEach((btn) => {
    btn.addEventListener("click", () => makeGuess(btn.dataset.id!));
  });
  document.querySelector<HTMLButtonElement>("#leave-btn")!.addEventListener("click", leaveRoom);
}

render();
