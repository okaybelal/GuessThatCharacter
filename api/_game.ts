import { characters } from "../src/characters.js";

export type Team = "Red" | "Blue";

export interface Player {
  id: string;
  name: string;
  team: Team;
}

export interface LogEntry {
  team: Team;
  playerName: string;
  kind: "question" | "guess";
  key?: string;
  characterId?: string;
  result: string;
}

export interface Room {
  code: string;
  status: "lobby" | "picking" | "playing" | "finished";
  players: Player[];
  redSecretId?: string;
  blueSecretId?: string;
  redEliminated: string[];
  blueEliminated: string[];
  turnTeam: Team;
  log: LogEntry[];
  winner?: Team;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function newPlayerId() {
  return Math.random().toString(36).slice(2, 10);
}

function otherTeam(team: Team): Team {
  return team === "Red" ? "Blue" : "Red";
}

function charInfo(id?: string) {
  if (!id) return undefined;
  const c = characters.find((ch) => ch.id === id);
  return c ? { id: c.id, name: c.name, source: c.source } : undefined;
}

export function genCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export function roomIsReady(room: Room) {
  const red = room.players.filter((p) => p.team === "Red").length;
  const blue = room.players.filter((p) => p.team === "Blue").length;
  return red >= 1 && blue >= 1;
}

export function pickTeam(room: Room): Team {
  const red = room.players.filter((p) => p.team === "Red").length;
  const blue = room.players.filter((p) => p.team === "Blue").length;
  return red <= blue ? "Red" : "Blue";
}

export function createRoom(name: string): { room: Room; playerId: string } {
  const playerId = newPlayerId();
  const room: Room = {
    code: genCode(),
    status: "lobby",
    players: [{ id: playerId, name: String(name || "Player").slice(0, 20), team: "Red" }],
    redEliminated: [],
    blueEliminated: [],
    turnTeam: "Red",
    log: [],
  };
  return { room, playerId };
}

export function joinRoom(room: Room, name: string): string {
  if (room.status !== "lobby") throw new ApiError(400, "Game already in progress.");
  const playerId = newPlayerId();
  room.players.push({ id: playerId, name: String(name || "Player").slice(0, 20), team: pickTeam(room) });
  return playerId;
}

export function switchTeam(room: Room, playerId: string, team: string) {
  if (room.status !== "lobby") throw new ApiError(400, "Game already started.");
  const player = room.players.find((p) => p.id === playerId);
  if (!player) throw new ApiError(404, "Player not found.");
  player.team = team === "Blue" ? "Blue" : "Red";
}

export function startGame(room: Room, playerId: string) {
  if (!room.players.some((p) => p.id === playerId)) throw new ApiError(404, "Player not found.");
  if (room.status !== "lobby") throw new ApiError(400, "Game already started.");
  if (!roomIsReady(room)) throw new ApiError(400, "Need at least one player on each team.");
  room.status = "picking";
}

export function pickCharacter(room: Room, playerId: string, characterId: string) {
  if (room.status !== "picking") throw new ApiError(400, "Not in the picking phase.");
  const player = room.players.find((p) => p.id === playerId);
  if (!player) throw new ApiError(404, "Player not found.");
  if (!characters.some((c) => c.id === characterId)) throw new ApiError(400, "Unknown character.");

  if (player.team === "Red") room.redSecretId = characterId;
  else room.blueSecretId = characterId;

  if (room.redSecretId && room.blueSecretId) {
    room.status = "playing";
    room.turnTeam = "Red";
    room.log = [];
    room.redEliminated = [];
    room.blueEliminated = [];
  }
}

export function askQuestion(room: Room, playerId: string, key: string) {
  if (room.status !== "playing") throw new ApiError(400, "Game is not in progress.");
  const player = room.players.find((p) => p.id === playerId);
  if (!player || player.team !== room.turnTeam) throw new ApiError(403, "Not your turn.");

  const opponent = otherTeam(player.team);
  const opponentSecretId = opponent === "Red" ? room.redSecretId : room.blueSecretId;
  const secret = characters.find((c) => c.id === opponentSecretId)!;
  const answer = (secret.attributes as any)[key];
  if (answer === undefined) throw new ApiError(400, "Invalid question.");

  const eliminated = player.team === "Red" ? room.redEliminated : room.blueEliminated;
  characters.forEach((c) => {
    if (eliminated.includes(c.id)) return;
    if ((c.attributes as any)[key] !== answer) eliminated.push(c.id);
  });

  room.log.push({ team: player.team, playerName: player.name, kind: "question", key, result: answer ? "Yes" : "No" });
  room.turnTeam = opponent;
}

export function makeGuess(room: Room, playerId: string, characterId: string) {
  if (room.status !== "playing") throw new ApiError(400, "Game is not in progress.");
  const player = room.players.find((p) => p.id === playerId);
  if (!player || player.team !== room.turnTeam) throw new ApiError(403, "Not your turn.");
  const guessed = characters.find((c) => c.id === characterId);
  if (!guessed) throw new ApiError(400, "Unknown character.");

  const opponent = otherTeam(player.team);
  const opponentSecretId = opponent === "Red" ? room.redSecretId : room.blueSecretId;
  const correct = characterId === opponentSecretId;

  room.log.push({ team: player.team, playerName: player.name, kind: "guess", characterId, result: correct ? "Correct!" : "Wrong" });

  if (correct) {
    room.status = "finished";
    room.winner = player.team;
  } else {
    const eliminated = player.team === "Red" ? room.redEliminated : room.blueEliminated;
    if (!eliminated.includes(characterId)) eliminated.push(characterId);
    room.turnTeam = opponent;
  }
}

export function restartGame(room: Room, playerId: string) {
  if (!room.players.some((p) => p.id === playerId)) throw new ApiError(404, "Player not found.");
  if (room.status !== "finished") throw new ApiError(400, "Game is not finished yet.");
  room.status = "picking";
  room.redSecretId = undefined;
  room.blueSecretId = undefined;
  room.redEliminated = [];
  room.blueEliminated = [];
  room.log = [];
  room.winner = undefined;
  room.turnTeam = "Red";
}

export function leaveRoom(room: Room, playerId: string) {
  room.players = room.players.filter((p) => p.id !== playerId);
}

export function publicRoom(room: Room, viewerTeam?: Team) {
  const finished = room.status === "finished";
  return {
    code: room.code,
    status: room.status,
    players: room.players,
    turnTeam: room.turnTeam,
    log: room.log,
    winner: room.winner,
    redPicked: !!room.redSecretId,
    bluePicked: !!room.blueSecretId,
    redEliminated: room.redEliminated,
    blueEliminated: room.blueEliminated,
    mySecret: viewerTeam ? charInfo(viewerTeam === "Red" ? room.redSecretId : room.blueSecretId) ?? null : null,
    reveal: finished ? { red: charInfo(room.redSecretId), blue: charInfo(room.blueSecretId) } : undefined,
  };
}
