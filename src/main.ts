import "./style.css";
import { characters, categories, buildQuestionText, type Character } from "./characters";
import { avatarSVG } from "./avatar";

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
  categoryKey?: string;
  value?: string;
  characterId?: string;
  result: string;
}

interface RoomState {
  code: string;
  status: "lobby" | "picking" | "playing" | "finished";
  players: PublicPlayer[];
  turnTeam: Team;
  askedThisTurn: boolean;
  log: LogEntry[];
  winner?: Team;
  redPicked: boolean;
  bluePicked: boolean;
  redEliminated: string[];
  blueEliminated: string[];
  redCrossed: string[];
  blueCrossed: string[];
  mySecret: Character | null;
  reveal?: { red?: Character; blue?: Character };
}

const app = document.querySelector<HTMLDivElement>("#app")!;

let myPlayerId: string | null = null;
let myToken: string | null = null;
let room: RoomState | null = null;
let errorMsg = "";
let playerName = localStorage.getItem("gtc-name") || "";
let pollTimer: ReturnType<typeof setInterval> | null = null;
let openCategoryKey: string | null = null;

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

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
      const data = await api(`/rooms/${code}?playerId=${myPlayerId}&token=${myToken}`, "GET");
      if (JSON.stringify(data.room) === JSON.stringify(room)) return;
      room = data.room;
      render();
    } catch {
      stopPolling();
      room = null;
      myPlayerId = null;
      myToken = null;
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
    myToken = data.token;
    room = data.room;
    errorMsg = "";
    startPolling(room!.code);
    render();
  } catch (e: any) {
    errorMsg = e.message;
    render();
  }
}

async function roomAction(code: string, body: Record<string, unknown>) {
  return api(`/rooms/${code}/action`, "POST", body);
}

async function joinRoom(code: string) {
  const trimmed = code.trim().toUpperCase();
  if (!playerName.trim() || !trimmed) return;
  localStorage.setItem("gtc-name", playerName);
  try {
    const data = await roomAction(trimmed, { action: "join", name: playerName });
    myPlayerId = data.playerId;
    myToken = data.token;
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
    const data = await roomAction(room.code, { action: "team", playerId: myPlayerId, token: myToken, team });
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
    const data = await roomAction(room.code, { action: "start", playerId: myPlayerId, token: myToken });
    room = data.room;
    errorMsg = "";
    render();
  } catch (e: any) {
    errorMsg = e.message;
    render();
  }
}

async function pickCharacter(characterId: string) {
  if (!room || !myPlayerId) return;
  try {
    const data = await roomAction(room.code, { action: "pick", playerId: myPlayerId, token: myToken, characterId });
    room = data.room;
    render();
  } catch (e: any) {
    errorMsg = e.message;
    render();
  }
}

async function askQuestion(categoryKey: string, value: string) {
  if (!room || !myPlayerId) return;
  try {
    const data = await roomAction(room.code, { action: "question", playerId: myPlayerId, token: myToken, categoryKey, value });
    room = data.room;
    openCategoryKey = null;
    render();
  } catch (e: any) {
    errorMsg = e.message;
    openCategoryKey = null;
    render();
  }
}

async function passTurn() {
  if (!room || !myPlayerId) return;
  try {
    const data = await roomAction(room.code, { action: "pass", playerId: myPlayerId, token: myToken });
    room = data.room;
    render();
  } catch (e: any) {
    errorMsg = e.message;
    render();
  }
}

async function toggleCross(characterId: string) {
  if (!room || !myPlayerId) return;
  try {
    const data = await roomAction(room.code, { action: "cross", playerId: myPlayerId, token: myToken, characterId });
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
    const data = await roomAction(room.code, { action: "guess", playerId: myPlayerId, token: myToken, characterId });
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
    const data = await roomAction(room.code, { action: "restart", playerId: myPlayerId, token: myToken });
    room = data.room;
    errorMsg = "";
    openCategoryKey = null;
    render();
  } catch (e: any) {
    errorMsg = e.message;
    render();
  }
}

async function leaveRoom() {
  if (room && myPlayerId) {
    try {
      await roomAction(room.code, { action: "leave", playerId: myPlayerId, token: myToken });
    } catch {
      // room may already be gone; leaving locally regardless
    }
  }
  stopPolling();
  room = null;
  myPlayerId = null;
  myToken = null;
  openCategoryKey = null;
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
  } else if (room.status === "picking") {
    const team = myTeam();
    if (team) document.body.setAttribute("data-turn", team === "Blue" ? "blue" : "red");
    else document.body.removeAttribute("data-turn");
    renderPicking();
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
          <input id="name-input" type="text" maxlength="20" value="${escapeHtml(playerName)}" placeholder="Enter your name" />
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
        ${errorMsg ? `<p class="error">${escapeHtml(errorMsg)}</p>` : ""}
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
            <ul>${teamRed.map((p) => `<li>${escapeHtml(p.name)}${p.id === myPlayerId ? " (you)" : ""}</li>`).join("") || "<li class='empty'>Empty</li>"}</ul>
            ${my !== "Red" ? `<button class="switch-btn" data-team="Red">Join Red</button>` : ""}
          </div>
          <div class="team-col team-blue">
            <h2>🔵 Team Blue (${teamBlue.length})</h2>
            <ul>${teamBlue.map((p) => `<li>${escapeHtml(p.name)}${p.id === myPlayerId ? " (you)" : ""}</li>`).join("") || "<li class='empty'>Empty</li>"}</ul>
            ${my !== "Blue" ? `<button class="switch-btn" data-team="Blue">Join Blue</button>` : ""}
          </div>
        </div>

        <button id="start-btn" class="restart" ${ready ? "" : "disabled"}>${ready ? "▶️ Start Game" : "Need at least 1 player on each team"}</button>
        <button id="leave-btn" class="leave">Leave Room</button>
        ${errorMsg ? `<p class="error">${escapeHtml(errorMsg)}</p>` : ""}
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
          ${myPicked ? `✅ Your team picked <strong>${escapeHtml(r.mySecret!.name)}</strong>` : "❓ Your team hasn't picked yet"}
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

function answerBadge(categoryKey: string | undefined, result: string): string {
  const cat = categories.find((c) => c.key === categoryKey);
  const icon = cat?.icon ?? "❓";
  const isYes = result === "Yes";
  return `<span class="answer-badge ${isYes ? "answer-yes" : "answer-no"}">${icon} ${isYes ? "✅" : "❌"}</span>`;
}

function renderGame() {
  const r = room!;
  const team = myTeam();
  const isMyTurn = team === r.turnTeam;
  const finished = r.status === "finished";
  if (!isMyTurn || finished) openCategoryKey = null;

  const activeEliminated = r.turnTeam === "Blue" ? r.blueEliminated : r.redEliminated;
  const activeCrossed = r.turnTeam === "Blue" ? r.blueCrossed : r.redCrossed;
  const remaining = characters.filter((c) => !activeEliminated.includes(c.id) && !activeCrossed.includes(c.id));
  const isLastCard = remaining.length === 1;
  const isOverCrossed = remaining.length === 0;
  const canAct = isLastCard ? isMyTurn && !finished : isMyTurn && !finished && r.askedThisTurn && !isOverCrossed;
  const canInteractBoard = isMyTurn && !finished;

  app.innerHTML = `
    <div class="game">
      <header>
        <h1>🎭 Guess That Character</h1>
        <p class="subtitle">Room ${r.code}${r.mySecret ? ` · Your character: <strong>${escapeHtml(r.mySecret.name)}</strong>` : ""}</p>
        ${!finished ? `<p class="counter">${isMyTurn ? "🟢 Your team's turn!" : `⏳ Waiting on Team ${r.turnTeam}`}</p>` : ""}
      </header>

      <section class="teams-bar">
        <div class="team-chip team-red ${r.turnTeam === "Red" ? "active" : ""}">🔴 Red: ${r.players.filter((p) => p.team === "Red").map((p) => escapeHtml(p.name)).join(", ") || "—"}</div>
        <div class="team-chip team-blue ${r.turnTeam === "Blue" ? "active" : ""}">🔵 Blue: ${r.players.filter((p) => p.team === "Blue").map((p) => escapeHtml(p.name)).join(", ") || "—"}</div>
      </section>

      <section class="questions">
        <h2>Ask a Question ${team ? `(Team ${team})` : ""}</h2>
        ${isMyTurn && !finished && r.askedThisTurn ? `<p class="hint">You've asked your question for this turn — pass or lock in a guess.</p>` : ""}
        <div class="category-grid">
          ${categories
            .map(
              (cat) => `
            <button class="cat-btn" data-key="${cat.key}" ${isMyTurn && !finished && !r.askedThisTurn ? "" : "disabled"}>
              <span class="cat-icon">${cat.icon}</span>
              <span class="cat-label">${cat.label}</span>
            </button>`
            )
            .join("")}
        </div>
        <div class="log">
          ${r.log
            .slice()
            .reverse()
            .slice(0, 8)
            .map((entry) => {
              const name = escapeHtml(entry.playerName);
              if (entry.kind === "question") {
                const qText = buildQuestionText(entry.categoryKey!, entry.value!);
                return `<div class="log-entry">Team ${entry.team} · ${name}: "${qText}" ${answerBadge(entry.categoryKey, entry.result)}</div>`;
              }
              if (entry.kind === "pass") {
                return `<div class="log-entry">Team ${entry.team} · ${name} passed the turn</div>`;
              }
              const c = characters.find((ch) => ch.id === entry.characterId);
              return `<div class="log-entry">Team ${entry.team} · ${name} guessed <strong>${c?.name}</strong> → <strong>${entry.result}</strong></div>`;
            })
            .join("")}
        </div>
      </section>

      <section class="board">
        <h2>${finished ? "Characters" : `Team ${r.turnTeam}'s Board${isMyTurn ? " (Your Turn)" : ""}`}</h2>
        ${!finished ? `<p class="hint">Click a character to cross it off. Crossing off a card the game hasn't ruled out yet is flagged in red — your risk. Once you're down to one, lock in your guess below.</p>` : ""}
        <div class="grid">
          ${characters
            .map((c) => {
              const isOut = activeEliminated.includes(c.id);
              const crossed = activeCrossed.includes(c.id);
              return `
              <div class="card ${isOut ? "eliminated" : ""} ${crossed ? "self-crossed" : ""} ${canInteractBoard && !isOut ? "interactive" : ""}" data-id="${c.id}">
                <span class="avatar">${avatarSVG(c)}</span>
                <span class="name">${c.name}</span>
                <span class="source">${c.source}</span>
                ${crossed ? `<span class="risk-badge">✕</span>` : ""}
              </div>`;
            })
            .join("")}
        </div>
        ${
          isMyTurn && !finished && isOverCrossed
            ? `<p class="hint warning">You've crossed off every candidate — bring one back before you can pass or guess.</p>`
            : ""
        }
        ${
          !finished
            ? `<button id="turn-action-btn" class="guess-btn ${isLastCard ? "highlight" : ""}" ${canAct ? "" : "disabled"}>
                ${isLastCard ? `Guess: ${remaining[0].name}` : isOverCrossed ? "Bring back a card" : "Pass"}
              </button>`
            : ""
        }
      </section>

      <button id="leave-btn" class="leave">Leave Room</button>
    </div>

    ${finished ? renderWinnerModal(r, team) : ""}
    ${!finished && openCategoryKey ? renderCategoryModal(openCategoryKey) : ""}
  `;

  document.querySelectorAll<HTMLButtonElement>(".cat-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      openCategoryKey = btn.dataset.key!;
      render();
    });
  });
  if (canInteractBoard) {
    document.querySelectorAll<HTMLDivElement>(".board .card.interactive").forEach((card) => {
      card.addEventListener("click", () => toggleCross(card.dataset.id!));
    });
  }
  if (canAct) {
    document.querySelector<HTMLButtonElement>("#turn-action-btn")!.addEventListener("click", () => {
      if (isLastCard) makeGuess(remaining[0].id);
      else passTurn();
    });
  }
  document.querySelector<HTMLButtonElement>("#leave-btn")!.addEventListener("click", leaveRoom);

  if (finished) {
    document.querySelector<HTMLButtonElement>("#play-again-btn")?.addEventListener("click", restartGame);
    document.querySelector<HTMLButtonElement>("#modal-leave-btn")?.addEventListener("click", leaveRoom);
  }

  if (!finished && openCategoryKey) {
    document.querySelector<HTMLButtonElement>("#category-modal-close")!.addEventListener("click", () => {
      openCategoryKey = null;
      render();
    });
    document.querySelector<HTMLDivElement>("#category-modal-backdrop")!.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) {
        openCategoryKey = null;
        render();
      }
    });
    document.querySelectorAll<HTMLButtonElement>(".value-btn").forEach((btn) => {
      btn.addEventListener("click", () => askQuestion(openCategoryKey!, btn.dataset.value!));
    });
  }
}

function renderCategoryModal(categoryKey: string) {
  const cat = categories.find((c) => c.key === categoryKey);
  if (!cat) return "";
  return `
    <div class="modal-backdrop" id="category-modal-backdrop">
      <div class="modal-card category-modal">
        <button class="modal-close" id="category-modal-close">✕</button>
        <h2>${cat.icon} ${cat.label}</h2>
        <div class="value-grid">
          ${cat.values
            .map(
              (v) => `
            <button class="value-btn" data-value="${v.value}">
              <span class="value-icon">${v.icon}</span>
              <span class="value-label">${v.label}</span>
            </button>`
            )
            .join("")}
        </div>
      </div>
    </div>
  `;
}

function renderWinnerModal(r: RoomState, team: Team | null) {
  const won = r.winner === team;
  const redChar = r.reveal?.red;
  const blueChar = r.reveal?.blue;

  return `
    <div class="modal-backdrop">
      <div class="modal-card ${r.winner === "Blue" ? "team-blue" : "team-red"}">
        <div class="modal-emoji">${won ? "🎉" : "😢"}</div>
        <div class="winner-banner ${r.winner === "Blue" ? "banner-blue" : "banner-red"}">TEAM ${r.winner?.toUpperCase()} WINS!</div>
        <p class="modal-sub">${won ? "Your team guessed it right!" : "Better luck next time."}</p>
        <div class="reveal-portraits">
          <div class="reveal-portrait-item frame-red">
            <span class="avatar large">${redChar ? avatarSVG(redChar) : ""}</span>
            <span class="reveal-name">${redChar?.name ?? "—"}</span>
            <span class="reveal-caption">🔴 Red picked</span>
          </div>
          <div class="reveal-portrait-item frame-blue">
            <span class="avatar large">${blueChar ? avatarSVG(blueChar) : ""}</span>
            <span class="reveal-name">${blueChar?.name ?? "—"}</span>
            <span class="reveal-caption">🔵 Blue picked</span>
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
