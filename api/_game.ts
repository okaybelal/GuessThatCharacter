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
  status: "lobby" | "playing" | "finished";
  players: Player[];
  secretId: string;
  eliminated: string[];
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
    secretId: characters[Math.floor(Math.random() * characters.length)].id,
    eliminated: [],
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
  if (!roomIsReady(room)) throw new ApiError(400, "Need at least one player on each team.");
  room.status = "playing";
}

export function askQuestion(room: Room, playerId: string, key: string) {
  if (room.status !== "playing") throw new ApiError(400, "Game is not in progress.");
  const player = room.players.find((p) => p.id === playerId);
  if (!player || player.team !== room.turnTeam) throw new ApiError(403, "Not your turn.");
  const secret = characters.find((c) => c.id === room.secretId)!;
  const answer = (secret.attributes as any)[key];
  if (answer === undefined) throw new ApiError(400, "Invalid question.");
  characters.forEach((c) => {
    if (room.eliminated.includes(c.id)) return;
    if ((c.attributes as any)[key] !== answer) room.eliminated.push(c.id);
  });
  room.log.push({ team: player.team, playerName: player.name, kind: "question", key, result: answer ? "Yes" : "No" });
  room.turnTeam = room.turnTeam === "Red" ? "Blue" : "Red";
}

export function makeGuess(room: Room, playerId: string, characterId: string) {
  if (room.status !== "playing") throw new ApiError(400, "Game is not in progress.");
  const player = room.players.find((p) => p.id === playerId);
  if (!player || player.team !== room.turnTeam) throw new ApiError(403, "Not your turn.");
  const guessed = characters.find((c) => c.id === characterId);
  if (!guessed) throw new ApiError(400, "Unknown character.");
  const correct = characterId === room.secretId;
  room.log.push({ team: player.team, playerName: player.name, kind: "guess", characterId, result: correct ? "Correct!" : "Wrong" });
  if (correct) {
    room.status = "finished";
    room.winner = player.team;
  } else {
    if (!room.eliminated.includes(characterId)) room.eliminated.push(characterId);
    room.turnTeam = room.turnTeam === "Red" ? "Blue" : "Red";
  }
}

export function leaveRoom(room: Room, playerId: string) {
  room.players = room.players.filter((p) => p.id !== playerId);
}

export function publicRoom(room: Room) {
  return {
    code: room.code,
    status: room.status,
    players: room.players,
    eliminated: room.eliminated,
    turnTeam: room.turnTeam,
    log: room.log,
    winner: room.winner,
    secretName: room.status === "finished" ? characters.find((c) => c.id === room.secretId)?.name : undefined,
    secretSource: room.status === "finished" ? characters.find((c) => c.id === room.secretId)?.source : undefined,
  };
}
