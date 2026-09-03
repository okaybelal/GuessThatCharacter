import "./style.css";
import { packs, getPack, buildQuestionText, type Character } from "./characters";
import { avatarSVG } from "./avatar";
import { playSound, isSoundEnabled, setSoundEnabled } from "./sound";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (resp: { credential: string }) => void }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
  interface ImportMetaEnv {
    readonly VITE_GOOGLE_CLIENT_ID?: string;
  }
}

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
  hostId: string;
  pack: string;
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

interface PublicUser {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
}

interface FriendView extends PublicUser {
  online: boolean;
}

interface IncomingRequestView {
  id: string;
  from: PublicUser;
}

interface PendingInviteView {
  id: string;
  from: PublicUser;
  roomCode: string;
}

const app = document.querySelector<HTMLDivElement>("#app")!;

let myPlayerId: string | null = null;
let myToken: string | null = null;
let room: RoomState | null = null;
let errorMsg = "";
let playerName = localStorage.getItem("gtc-name") || "";
let pollTimer: ReturnType<typeof setInterval> | null = null;
let openCategoryKey: string | null = null;

let sessionToken: string | null = localStorage.getItem("gtc-session");
let currentUser: PublicUser | null = null;
let friends: FriendView[] = [];
let incomingRequests: IncomingRequestView[] = [];
let pendingInvites: PendingInviteView[] = [];
let friendsPanelOpen = false;
let addFriendInput = "";
let socialError = "";
let socialPollTimer: ReturnType<typeof setInterval> | null = null;

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

function applySocialState(data: { friends?: FriendView[]; incomingRequests?: IncomingRequestView[]; pendingInvites?: PendingInviteView[] }) {
  if (data.friends) friends = data.friends;
  if (data.incomingRequests) incomingRequests = data.incomingRequests;
  if (data.pendingInvites) pendingInvites = data.pendingInvites;
}

function stopSocialPolling() {
  if (socialPollTimer) {
    clearInterval(socialPollTimer);
    socialPollTimer = null;
  }
}

function startSocialPolling() {
  stopSocialPolling();
  socialPollTimer = setInterval(async () => {
    if (!sessionToken) return;
    try {
      const data = await api(`/social?token=${sessionToken}`, "GET");
      applySocialState(data);
      renderAuthWidget();
      if (room) render();
    } catch {
      // transient network/poll failure — try again next tick
    }
  }, 5000);
}

async function restoreSession() {
  if (!sessionToken) return;
  try {
    const data = await api(`/auth?token=${sessionToken}`, "GET");
    currentUser = data.user;
    if (!playerName.trim() && currentUser) playerName = currentUser.name;
    startSocialPolling();
    const social = await api(`/social?token=${sessionToken}`, "GET");
    applySocialState(social);
    renderAuthWidget();
  } catch {
    sessionToken = null;
    localStorage.removeItem("gtc-session");
    renderAuthWidget();
  }
}

async function handleGoogleCredential(idToken: string) {
  try {
    const data = await api("/auth", "POST", { action: "signin", idToken });
    currentUser = data.user;
    sessionToken = data.token;
    localStorage.setItem("gtc-session", data.token);
    if (!playerName.trim() && currentUser) {
      playerName = currentUser.name;
      localStorage.setItem("gtc-name", playerName);
    }
    socialError = "";
    startSocialPolling();
    const social = await api(`/social?token=${sessionToken}`, "GET");
    applySocialState(social);
    renderAuthWidget();
  } catch (e: any) {
    socialError = e.message;
    renderAuthWidget();
  }
}

async function signOutUser() {
  const token = sessionToken;
  currentUser = null;
  sessionToken = null;
  friends = [];
  incomingRequests = [];
  pendingInvites = [];
  friendsPanelOpen = false;
  localStorage.removeItem("gtc-session");
  stopSocialPolling();
  renderAuthWidget();
  if (token) {
    try {
      await api("/auth", "POST", { action: "logout", token });
    } catch {
      // best effort
    }
  }
}

async function sendFriendRequestByUsername() {
  const username = addFriendInput.trim();
  if (!username || !sessionToken) return;
  try {
    const data = await api("/social", "POST", { action: "send-friend-request", token: sessionToken, username });
    applySocialState(data);
    addFriendInput = "";
    socialError = "";
  } catch (e: any) {
    socialError = e.message;
  }
  renderAuthWidget();
}

async function respondToFriendRequest(requestId: string, accept: boolean) {
  if (!sessionToken) return;
  try {
    const data = await api("/social", "POST", { action: "respond-friend-request", token: sessionToken, requestId, accept });
    applySocialState(data);
    playSound("click");
  } catch (e: any) {
    socialError = e.message;
  }
  renderAuthWidget();
}

async function removeFriendById(friendId: string) {
  if (!sessionToken) return;
  try {
    const data = await api("/social", "POST", { action: "remove-friend", token: sessionToken, friendId });
    applySocialState(data);
  } catch (e: any) {
    socialError = e.message;
  }
  renderAuthWidget();
}

async function sendInviteToFriend(toUserId: string, btn: HTMLButtonElement) {
  if (!sessionToken || !room) return;
  try {
    await api("/social", "POST", { action: "send-invite", token: sessionToken, toUserId, roomCode: room.code });
    const original = btn.textContent;
    btn.textContent = "✅ Sent!";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 1500);
  } catch (e: any) {
    socialError = e.message;
    renderAuthWidget();
  }
}

async function respondToInvite(inviteId: string, accept: boolean) {
  if (!sessionToken) return;
  try {
    const data = await api("/social", "POST", { action: "respond-invite", token: sessionToken, inviteId, accept });
    applySocialState(data);
    renderAuthWidget();
    if (accept && data.roomCode) {
      friendsPanelOpen = false;
      await joinRoom(data.roomCode);
    }
  } catch (e: any) {
    socialError = e.message;
    renderAuthWidget();
  }
}

function teamOf(r: RoomState | null): Team | null {
  if (!r || !myPlayerId) return null;
  return r.players.find((p) => p.id === myPlayerId)?.team ?? null;
}

function setRoom(newRoom: RoomState | null) {
  const wasFinished = room?.status === "finished";
  if (newRoom && !wasFinished && newRoom.status === "finished") {
    playSound(newRoom.winner === teamOf(newRoom) ? "win" : "lose");
  }
  room = newRoom;
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
      setRoom(data.room);
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
    setRoom(data.room);
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
    setRoom(data.room);
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
    setRoom(data.room);
    render();
  } catch (e: any) {
    errorMsg = e.message;
    render();
  }
}

async function choosePack(packKey: string) {
  if (!room || !myPlayerId) return;
  try {
    const data = await roomAction(room.code, { action: "pack", playerId: myPlayerId, token: myToken, packKey });
    setRoom(data.room);
    playSound("click");
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
    setRoom(data.room);
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
    setRoom(data.room);
    playSound("click");
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
    setRoom(data.room);
    const lastEntry = data.room.log[data.room.log.length - 1];
    playSound(lastEntry?.result === "Yes" ? "yes" : "no");
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
    setRoom(data.room);
    playSound("pass");
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
    setRoom(data.room);
    playSound("click");
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
    setRoom(data.room);
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
    setRoom(data.room);
    errorMsg = "";
    openCategoryKey = null;
    render();
  } catch (e: any) {
    errorMsg = e.message;
    render();
  }
}

async function backToLobby() {
  if (!room || !myPlayerId) return;
  try {
    const data = await roomAction(room.code, { action: "lobby", playerId: myPlayerId, token: myToken });
    setRoom(data.room);
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

async function copyToClipboard(btn: HTMLButtonElement, text: string, copiedLabel: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }
  const original = btn.textContent;
  btn.textContent = copiedLabel;
  btn.classList.add("copied");
  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove("copied");
  }, 1200);
}

function inviteLink(code: string): string {
  return `${location.origin}${location.pathname}?room=${code}`;
}

function myTeam(): Team | null {
  return teamOf(room);
}

function currentPack() {
  return getPack(room?.pack);
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
  const codeFromLink = new URLSearchParams(location.search).get("room")?.toUpperCase() ?? "";

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
              <input id="code-input" type="text" maxlength="5" placeholder="ROOM CODE" value="${escapeHtml(codeFromLink)}" />
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

function renderInviteFriendsSection(): string {
  const online = friends.filter((f) => f.online);
  return `
    <div class="invite-friends">
      <h2>Invite an Online Friend</h2>
      <div class="invite-friends-list">
        ${online
          .map(
            (f) => `
          <div class="invite-friend-row">
            <span class="friend-status online">●</span>
            <span>${escapeHtml(f.username)}</span>
            <button class="invite-friend-btn" data-id="${f.id}">Invite</button>
          </div>`
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderWaitingRoom() {
  const r = room!;
  const teamRed = r.players.filter((p) => p.team === "Red");
  const teamBlue = r.players.filter((p) => p.team === "Blue");
  const ready = teamRed.length >= 1 && teamBlue.length >= 1;
  const my = myTeam();
  const isHost = myPlayerId === r.hostId;
  const activePack = getPack(r.pack);

  app.innerHTML = `
    <div class="game lobby">
      <header>
        <h1>🎭 Guess That Character</h1>
        <p class="subtitle">Waiting room · Teams can be any size</p>
      </header>

      <section class="panel">
        <p class="room-code">Room Code: <strong>${r.code}</strong>
          <button id="copy-code-btn" class="copy-btn" title="Copy room code" aria-label="Copy room code">📋</button>
        </p>
        <p class="hint">Share this code with your friends so they can join. Anyone can switch teams before the game starts.</p>
        <button id="copy-link-btn" class="share-link-btn">🔗 Copy Invite Link</button>

        ${currentUser && friends.some((f) => f.online) ? renderInviteFriendsSection() : ""}

        <div class="pack-picker">
          <h2>Character Pack${isHost ? "" : ` — chosen by host`}</h2>
          <div class="pack-grid">
            ${packs
              .map(
                (p) => `
              <button class="pack-btn ${p.key === activePack.key ? "selected" : ""}" data-pack="${p.key}" ${isHost ? "" : "disabled"}>
                <span class="pack-icon">${p.icon}</span>
                <span class="pack-label">${p.label}</span>
              </button>`
              )
              .join("")}
          </div>
        </div>

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
  document.querySelector<HTMLButtonElement>("#copy-code-btn")!.addEventListener("click", (e) => {
    copyToClipboard(e.currentTarget as HTMLButtonElement, r.code, "✅");
  });
  document.querySelector<HTMLButtonElement>("#copy-link-btn")!.addEventListener("click", (e) => {
    copyToClipboard(e.currentTarget as HTMLButtonElement, inviteLink(r.code), "✅ Copied!");
  });
  document.querySelectorAll<HTMLButtonElement>(".switch-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchTeam(btn.dataset.team as Team));
  });
  if (isHost) {
    document.querySelectorAll<HTMLButtonElement>(".pack-btn").forEach((btn) => {
      btn.addEventListener("click", () => choosePack(btn.dataset.pack!));
    });
  }
  document.querySelectorAll<HTMLButtonElement>(".invite-friend-btn").forEach((btn) => {
    btn.addEventListener("click", () => sendInviteToFriend(btn.dataset.id!, btn));
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
          ${currentPack()
            .characters.map((c) => {
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
  const cat = currentPack().categories.find((c) => c.key === categoryKey);
  const icon = cat?.icon ?? "❓";
  const isYes = result === "Yes";
  return `<span class="answer-badge ${isYes ? "answer-yes" : "answer-no"}">${icon} ${isYes ? "✅" : "❌"}</span>`;
}

function renderGame() {
  const r = room!;
  const pack = currentPack();
  const team = myTeam();
  const isMyTurn = team === r.turnTeam;
  const finished = r.status === "finished";
  if (!isMyTurn || finished) openCategoryKey = null;

  const activeEliminated = r.turnTeam === "Blue" ? r.blueEliminated : r.redEliminated;
  const activeCrossed = r.turnTeam === "Blue" ? r.blueCrossed : r.redCrossed;
  const remaining = pack.characters.filter((c) => !activeEliminated.includes(c.id) && !activeCrossed.includes(c.id));
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
          ${pack.categories
            .map((cat) => {
              const distinctValues = new Set(remaining.map((c) => String((c as any)[cat.key])));
              const isDead = remaining.length > 1 && distinctValues.size <= 1;
              return `
            <button class="cat-btn ${isDead ? "cat-dead" : ""}" data-key="${cat.key}" ${isMyTurn && !finished && !r.askedThisTurn ? "" : "disabled"} ${isDead ? `title="Every remaining character shares this trait — asking won't narrow anything down."` : ""}>
              <span class="cat-icon">${cat.icon}</span>
              <span class="cat-label">${cat.label}</span>
              ${isDead ? `<span class="cat-dead-badge">won't narrow it down</span>` : ""}
            </button>`;
            })
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
                const qText = buildQuestionText(entry.categoryKey!, entry.value!, pack.categories);
                return `<div class="log-entry">Team ${entry.team} · ${name}: "${qText}" ${answerBadge(entry.categoryKey, entry.result)}</div>`;
              }
              if (entry.kind === "pass") {
                return `<div class="log-entry">Team ${entry.team} · ${name} passed the turn</div>`;
              }
              const c = pack.characters.find((ch) => ch.id === entry.characterId);
              return `<div class="log-entry">Team ${entry.team} · ${name} guessed <strong>${c?.name}</strong> → <strong>${entry.result}</strong></div>`;
            })
            .join("")}
        </div>
      </section>

      <section class="board">
        <h2>${finished ? "Characters" : `Team ${r.turnTeam}'s Board${isMyTurn ? " (Your Turn)" : ""}`}</h2>
        ${!finished ? `<p class="hint">Click a character to cross it off. Crossing off a card the game hasn't ruled out yet is flagged in red — your risk. Once you're down to one, lock in your guess below.</p>` : ""}
        <div class="grid">
          ${pack.characters
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
      playSound("click");
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
    document.querySelector<HTMLButtonElement>("#change-type-btn")?.addEventListener("click", backToLobby);
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
  const cat = currentPack().categories.find((c) => c.key === categoryKey);
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
          <button id="change-type-btn" class="share-link-btn">🔀 Change Game Type</button>
          <button id="modal-leave-btn" class="leave">Leave Room</button>
        </div>
      </div>
    </div>
  `;
}

function initSoundToggle() {
  const btn = document.createElement("button");
  btn.id = "sound-toggle";
  btn.className = "sound-toggle";
  btn.title = "Toggle sound";
  btn.setAttribute("aria-label", "Toggle sound");
  btn.textContent = isSoundEnabled() ? "🔊" : "🔇";
  btn.addEventListener("click", () => {
    setSoundEnabled(!isSoundEnabled());
    btn.textContent = isSoundEnabled() ? "🔊" : "🔇";
  });
  document.body.appendChild(btn);
}

const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) || "";

let googleSignInInitialized = false;

function initGoogleSignInButton(container: HTMLElement, attempt = 0) {
  if (!GOOGLE_CLIENT_ID) {
    container.innerHTML = `<span class="auth-unconfigured" title="Google sign-in is not configured yet">🔒 Sign-in unavailable</span>`;
    return;
  }
  if (!window.google?.accounts?.id) {
    if (attempt > 20) return;
    setTimeout(() => initGoogleSignInButton(container, attempt + 1), 250);
    return;
  }
  if (!googleSignInInitialized) {
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (resp) => handleGoogleCredential(resp.credential),
    });
    googleSignInInitialized = true;
  }
  window.google.accounts.id.renderButton(container, { theme: "filled_black", size: "medium", shape: "pill" });
}

function renderFriendsPanel(): string {
  return `
    <div class="friends-backdrop">
      <div class="friends-panel">
        <button id="friends-panel-close" class="modal-close">✕</button>
        <h2>👥 Friends</h2>
        ${socialError ? `<p class="error">${escapeHtml(socialError)}</p>` : ""}

        <div class="add-friend-row">
          <input id="add-friend-input" type="text" placeholder="Add by username" value="${escapeHtml(addFriendInput)}" maxlength="20" />
          <button id="add-friend-btn" class="mode-btn">Add</button>
        </div>

        ${
          pendingInvites.length
            ? `<h3>Game Invites</h3><div class="invite-list">
                ${pendingInvites
                  .map(
                    (inv) => `
                  <div class="invite-row">
                    <span>${escapeHtml(inv.from.username)} invited you (Room ${escapeHtml(inv.roomCode)})</span>
                    <div class="invite-actions">
                      <button class="invite-accept-btn" data-id="${inv.id}">Join</button>
                      <button class="invite-decline-btn" data-id="${inv.id}">✕</button>
                    </div>
                  </div>`
                  )
                  .join("")}
              </div>`
            : ""
        }

        ${
          incomingRequests.length
            ? `<h3>Friend Requests</h3><div class="request-list">
                ${incomingRequests
                  .map(
                    (r) => `
                  <div class="request-row">
                    <span>${escapeHtml(r.from.username)}</span>
                    <div class="request-actions">
                      <button class="request-accept-btn" data-id="${r.id}">✅</button>
                      <button class="request-decline-btn" data-id="${r.id}">✕</button>
                    </div>
                  </div>`
                  )
                  .join("")}
              </div>`
            : ""
        }

        <h3>Your Friends (${friends.length})</h3>
        <div class="friend-list">
          ${
            friends.length
              ? friends
                  .map(
                    (f) => `
                <div class="friend-row">
                  <span class="friend-status ${f.online ? "online" : "offline"}">●</span>
                  <span>${escapeHtml(f.username)}</span>
                  <button class="friend-remove-btn" data-id="${f.id}" title="Remove friend">✕</button>
                </div>`
                  )
                  .join("")
              : `<p class="hint">No friends yet — add one by username above.</p>`
          }
        </div>
      </div>
    </div>
  `;
}

function renderAuthWidget() {
  const widget = document.getElementById("auth-widget");
  if (!widget) return;

  if (!currentUser) {
    widget.innerHTML = `<div id="google-signin-container"></div>${socialError ? `<p class="auth-error">${escapeHtml(socialError)}</p>` : ""}`;
    initGoogleSignInButton(document.getElementById("google-signin-container")!);
    return;
  }

  const notifCount = incomingRequests.length + pendingInvites.length;
  widget.innerHTML = `
    <div class="user-chip">
      <button id="friends-toggle-btn" class="friends-btn">
        👤 ${escapeHtml(currentUser.username)}${notifCount > 0 ? `<span class="notif-badge">${notifCount}</span>` : ""}
      </button>
      <button id="sign-out-btn" class="sign-out-btn" title="Sign out">⎋</button>
    </div>
    ${friendsPanelOpen ? renderFriendsPanel() : ""}
  `;

  document.getElementById("friends-toggle-btn")!.addEventListener("click", () => {
    friendsPanelOpen = !friendsPanelOpen;
    renderAuthWidget();
  });
  document.getElementById("sign-out-btn")!.addEventListener("click", () => signOutUser());

  if (friendsPanelOpen) {
    document.querySelector<HTMLDivElement>(".friends-backdrop")!.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) {
        friendsPanelOpen = false;
        renderAuthWidget();
      }
    });
    document.getElementById("friends-panel-close")!.addEventListener("click", () => {
      friendsPanelOpen = false;
      renderAuthWidget();
    });
    const input = document.getElementById("add-friend-input") as HTMLInputElement;
    input.addEventListener("input", () => (addFriendInput = input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendFriendRequestByUsername();
    });
    document.getElementById("add-friend-btn")!.addEventListener("click", () => sendFriendRequestByUsername());
    document.querySelectorAll<HTMLButtonElement>(".request-accept-btn").forEach((btn) => {
      btn.addEventListener("click", () => respondToFriendRequest(btn.dataset.id!, true));
    });
    document.querySelectorAll<HTMLButtonElement>(".request-decline-btn").forEach((btn) => {
      btn.addEventListener("click", () => respondToFriendRequest(btn.dataset.id!, false));
    });
    document.querySelectorAll<HTMLButtonElement>(".friend-remove-btn").forEach((btn) => {
      btn.addEventListener("click", () => removeFriendById(btn.dataset.id!));
    });
    document.querySelectorAll<HTMLButtonElement>(".invite-accept-btn").forEach((btn) => {
      btn.addEventListener("click", () => respondToInvite(btn.dataset.id!, true));
    });
    document.querySelectorAll<HTMLButtonElement>(".invite-decline-btn").forEach((btn) => {
      btn.addEventListener("click", () => respondToInvite(btn.dataset.id!, false));
    });
  }
}

function initAuthWidget() {
  const widget = document.createElement("div");
  widget.id = "auth-widget";
  document.body.appendChild(widget);
  renderAuthWidget();
  restoreSession();
}

initSoundToggle();
initAuthWidget();
render();
