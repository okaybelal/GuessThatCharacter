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
  kind: "question" | "guess" | "pass";
  key?: string;
  characterId?: string;
  result: string;
}

interface CharInfo {
  id: string;
  name: string;
  source: string;
}

interface RoomState {
  code: string;
  status: "lobby" | "picking" | "playing" | "finished";
  players: PublicPlayer[];
  turnTeam: Team;
  log: LogEntry[];
  winner?: Team;
  redPicked: boolean;
  bluePicked: boolean;
  redEliminated: string[];
  blueEliminated: string[];
  mySecret: CharInfo | null;
  reveal?: { red?: CharInfo; blue?: CharInfo };
}

const app = document.querySelector<HTMLDivElement>("#app")!;
let selfCrossed = new Set<string>();

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
      const data = await api(`/rooms/${code}?playerId=${myPlayerId}`, "GET");
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
    selfCrossed.clear();
    render();
  } catch (e: any) {
    errorMsg = e.message;
    render();
  }
}

function toggleSelfCrossed(characterId: string) {
  if (selfCrossed.has(characterId)) selfCrossed.delete(characterId);
  else selfCrossed.add(characterId);
  render();
}

async function pickCharacter(characterId: string) {
  if (!room || !myPlayerId) return;
  try {
    const data = await api(`/rooms/${room.code}/pick`, "POST", { playerId: myPlayerId, characterId });
    room = data.room;
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

async function passTurn() {
  if (!room || !myPlayerId) return;
  try {
    const data = await api(`/rooms/${room.code}/pass`, "POST", { playerId: myPlayerId });
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

async function restartGame() {
  if (!room || !myPlayerId) return;
  try {
    const data = await api(`/rooms/${room.code}/restart`, "POST", { playerId: myPlayerId });
    room = data.room;
    errorMsg = "";
    selfCrossed.clear();
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
  } else if (room.status === "lobby" || room.status === "picking") {
    document.body.removeAttribute("data-turn");
    if (room.status === "lobby") renderWaitingRoom();
    else renderPicking();
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
        <p class="subtitle">Play solo vs. solo or team up with friends — each side secretly picks a character, then you take turns asking yes/no questions to guess the other side's pick first.</p>
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

function renderPicking() {
  const r = room!;
  const team = myTeam();
  const myPicked = !!r.mySecret;
  const opponentPicked = team === "Red" ? r.bluePicked : r.redPicked;

  app.innerHTML = `
    <div class="game">
      <header>
        <h1>🎭 Guess That Character</h1>
        <p class="subtitle">Room ${r.code} · Pick a secret character for the other team to guess</p>
        <p class="counter">
          ${myPicked ? `✅ Your team picked <strong>${r.mySecret!.name}</strong>` : "❓ Your team hasn't picked yet"}
          &nbsp;·&nbsp;
          ${opponentPicked ? "✅ Opponent is ready" : "⏳ Waiting on opponent to pick"}
        </p>
      </header>

      <section class="board">
        <h2>Choose Your Team's Character ${team ? `(Team ${team})` : ""}</h2>
        <div class="grid">
          ${characters
            .map((c) => {
              const selected = r.mySecret?.id === c.id;
              return `
              <button class="card ${selected ? "picked" : ""}" data-id="${c.id}">
                <span class="avatar">${avatarSVG(c)}</span>
                <span class="name">${c.name}</span>
                <span class="source">${c.source}</span>
                ${selected ? `<span class="picked-badge">Your Pick</span>` : ""}
              </button>`;
            })
            .join("")}
        </div>
      </section>

      <button id="leave-btn" class="leave">Leave Room</button>
    </div>
  `;

  document.querySelectorAll<HTMLButtonElement>(".card").forEach((btn) => {
    btn.addEventListener("click", () => pickCharacter(btn.dataset.id!));
  });
  document.querySelector<HTMLButtonElement>("#leave-btn")!.addEventListener("click", leaveRoom);
}

function renderGame() {
  const r = room!;
  const team = myTeam();
  const isMyTurn = team === r.turnTeam;
  const finished = r.status === "finished";
  const activeEliminated = r.turnTeam === "Blue" ? r.blueEliminated : r.redEliminated;
  const remaining = characters.filter((c) => !activeEliminated.includes(c.id) && !selfCrossed.has(c.id));
  const canFinalGuess = isMyTurn && !finished && remaining.length === 1;

  app.innerHTML = `
    <div class="game">
      <header>
        <h1>🎭 Guess That Character</h1>
        <p class="subtitle">Room ${r.code}${r.mySecret ? ` · Your character: <strong>${r.mySecret.name}</strong>` : ""}</p>
        ${!finished ? `<p class="counter">${isMyTurn ? "🟢 Your team's turn!" : `⏳ Waiting on Team ${r.turnTeam}`}</p>` : ""}
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
        ${!finished ? `<button id="pass-btn" class="pass-btn" ${isMyTurn ? "" : "disabled"}>⏭️ Pass Turn</button>` : ""}
        <div class="log">
          ${r.log
            .slice()
            .reverse()
            .slice(0, 8)
            .map((entry) => {
              if (entry.kind === "question") {
                return `<div class="log-entry">Team ${entry.team} · ${entry.playerName}: "${attributeLabels[entry.key as AttrKey]}" → <strong>${entry.result}</strong></div>`;
              }
              if (entry.kind === "pass") {
                return `<div class="log-entry">Team ${entry.team} · ${entry.playerName} passed the turn</div>`;
              }
              const c = characters.find((ch) => ch.id === entry.characterId);
              return `<div class="log-entry">Team ${entry.team} · ${entry.playerName} guessed <strong>${c?.name}</strong> → <strong>${entry.result}</strong></div>`;
            })
            .join("")}
        </div>
      </section>

      <section class="board">
        <h2>${finished ? "Characters" : `Team ${r.turnTeam}'s Board${isMyTurn ? " (Your Turn)" : ""}`}</h2>
        ${!finished ? `<p class="hint">Click a character to cross it off your own list. Once you're down to one, lock in your guess below — get it wrong and you lose.</p>` : ""}
        <div class="grid">
          ${characters
            .map((c) => {
              const isOut = activeEliminated.includes(c.id);
              const crossed = selfCrossed.has(c.id);
              return `
              <div class="card ${isOut ? "eliminated" : ""} ${crossed ? "self-crossed" : ""}" data-id="${c.id}">
                <span class="avatar">${avatarSVG(c)}</span>
                <span class="name">${c.name}</span>
                <span class="source">${c.source}</span>
              </div>`;
            })
            .join("")}
        </div>
        ${
          !finished
            ? `<button id="final-guess-btn" class="guess-btn ${canFinalGuess ? "highlight" : ""}" ${canFinalGuess ? "" : "disabled"}>
                🎯 ${remaining.length === 1 ? `Guess: ${remaining[0].name}` : "Guess"}
              </button>`
            : ""
        }
      </section>

      <button id="leave-btn" class="leave">Leave Room</button>
    </div>

    ${finished ? renderWinnerModal(r, team) : ""}
  `;

  document.querySelectorAll<HTMLButtonElement>(".q-btn").forEach((btn) => {
    btn.addEventListener("click", () => askQuestion(btn.dataset.key as AttrKey));
  });
  document.querySelector<HTMLButtonElement>("#pass-btn")?.addEventListener("click", passTurn);
  document.querySelectorAll<HTMLDivElement>(".board .card:not(.eliminated)").forEach((card) => {
    card.addEventListener("click", () => toggleSelfCrossed(card.dataset.id!));
  });
  if (canFinalGuess) {
    document.querySelector<HTMLButtonElement>("#final-guess-btn")!.addEventListener("click", () => makeGuess(remaining[0].id));
  }
  document.querySelector<HTMLButtonElement>("#leave-btn")!.addEventListener("click", leaveRoom);

  if (finished) {
    document.querySelector<HTMLButtonElement>("#play-again-btn")?.addEventListener("click", restartGame);
    document.querySelector<HTMLButtonElement>("#modal-leave-btn")?.addEventListener("click", leaveRoom);
  }
}

function renderWinnerModal(r: RoomState, team: Team | null) {
  const won = r.winner === team;
  const redChar = r.reveal?.red;
  const blueChar = r.reveal?.blue;

  return `
    <div class="modal-backdrop">
      <div class="modal-card ${r.winner === "Blue" ? "team-blue" : "team-red"}">
        <div class="modal-emoji">${won ? "🎉" : "😢"}</div>
        <h2>${won ? "Congratulations!" : `Team ${r.winner} Wins!`}</h2>
        <p class="modal-sub">${won ? "Your team guessed it right!" : "Better luck next time."}</p>
        <div class="reveal-row">
          <div class="reveal-item">
            <span class="reveal-label">🔴 Red's character</span>
            <strong>${redChar?.name ?? "—"}</strong>
          </div>
          <div class="reveal-item">
            <span class="reveal-label">🔵 Blue's character</span>
            <strong>${blueChar?.name ?? "—"}</strong>
          </div>
        </div>
        <div class="modal-actions">
          <button id="play-again-btn" class="restart">🔁 Play Again</button>
          <button id="modal-leave-btn" class="leave">Leave Room</button>
        </div>
      </div>
    </div>
  `;
}

render();
