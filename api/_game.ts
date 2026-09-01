import crypto from "node:crypto";
import { characters, categories, categoryValueMatches } from "../src/characters.js";

export type Team = "Red" | "Blue";

export interface Player {
  id: string;
  token: string;
  name: string;
  team: Team;
}

export interface LogEntry {
  team: Team;
  playerName: string;
  kind: "question" | "guess" | "pass";
  categoryKey?: string;
  value?: string;
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
  redCrossed: string[];
  blueCrossed: string[];
  turnTeam: Team;
  askedThisTurn: boolean;
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

function newToken() {
  return crypto.randomUUID();
}

function requirePlayer(room: Room, playerId: string, token: string): Player {
  const player = room.players.find((p) => p.id === playerId);
  if (!player || player.token !== token) throw new ApiError(403, "Invalid session.");
  return player;
}

function otherTeam(team: Team): Team {
  return team === "Red" ? "Blue" : "Red";
}

function charInfo(id?: string) {
  if (!id) return undefined;
  return characters.find((ch) => ch.id === id);
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

export function createRoom(name: string): { room: Room; playerId: string; token: string } {
  const playerId = newPlayerId();
  const token = newToken();
  const room: Room = {
    code: genCode(),
    status: "lobby",
    players: [{ id: playerId, token, name: String(name || "Player").slice(0, 20), team: "Red" }],
    redEliminated: [],
    blueEliminated: [],
    redCrossed: [],
    blueCrossed: [],
    turnTeam: "Red",
    askedThisTurn: false,
    log: [],
  };
  return { room, playerId, token };
}

export function joinRoom(room: Room, name: string): { playerId: string; token: string } {
  if (room.status !== "lobby") throw new ApiError(400, "Game already in progress.");
  const playerId = newPlayerId();
  const token = newToken();
  room.players.push({ id: playerId, token, name: String(name || "Player").slice(0, 20), team: pickTeam(room) });
  return { playerId, token };
}

export function switchTeam(room: Room, playerId: string, token: string, team: string) {
  if (room.status !== "lobby") throw new ApiError(400, "Game already started.");
  const player = requirePlayer(room, playerId, token);
  player.team = team === "Blue" ? "Blue" : "Red";
}

export function startGame(room: Room, playerId: string, token: string) {
  requirePlayer(room, playerId, token);
  if (room.status !== "lobby") throw new ApiError(400, "Game already started.");
  if (!roomIsReady(room)) throw new ApiError(400, "Need at least one player on each team.");
  room.status = "picking";
}

export function pickCharacter(room: Room, playerId: string, token: string, characterId: string) {
  if (room.status !== "picking") throw new ApiError(400, "Not in the picking phase.");
  const player = requirePlayer(room, playerId, token);
  if (!characters.some((c) => c.id === characterId)) throw new ApiError(400, "Unknown character.");

  if (player.team === "Red") room.redSecretId = characterId;
  else room.blueSecretId = characterId;

  if (room.redSecretId && room.blueSecretId) {
    room.status = "playing";
    room.turnTeam = "Red";
    room.askedThisTurn = false;
    room.log = [];
    room.redEliminated = [];
    room.blueEliminated = [];
    room.redCrossed = [];
    room.blueCrossed = [];
  }
}

export function askQuestion(room: Room, playerId: string, token: string, categoryKey: string, value: string) {
  if (room.status !== "playing") throw new ApiError(400, "Game is not in progress.");
  const player = requirePlayer(room, playerId, token);
  if (player.team !== room.turnTeam) throw new ApiError(403, "Not your turn.");
  if (room.askedThisTurn) throw new ApiError(400, "You can only ask one question per turn. Pass or guess.");

  const category = categories.find((c) => c.key === categoryKey);
  if (!category) throw new ApiError(400, "Invalid question category.");
  if (!category.values.some((v) => v.value === value)) throw new ApiError(400, "Invalid question value.");

  const opponent = otherTeam(player.team);
  const opponentSecretId = opponent === "Red" ? room.redSecretId : room.blueSecretId;
  const secret = characters.find((c) => c.id === opponentSecretId)!;
  const answer = categoryValueMatches(secret, categoryKey, value);

  const eliminated = player.team === "Red" ? room.redEliminated : room.blueEliminated;
  characters.forEach((c) => {
    if (eliminated.includes(c.id)) return;
    if (categoryValueMatches(c, categoryKey, value) !== answer) eliminated.push(c.id);
  });

  room.log.push({ team: player.team, playerName: player.name, kind: "question", categoryKey, value, result: answer ? "Yes" : "No" });
  room.askedThisTurn = true;
}

export function passTurn(room: Room, playerId: string, token: string) {
  if (room.status !== "playing") throw new ApiError(400, "Game is not in progress.");
  const player = requirePlayer(room, playerId, token);
  if (player.team !== room.turnTeam) throw new ApiError(403, "Not your turn.");
  if (!room.askedThisTurn) throw new ApiError(400, "Ask your question before passing.");

  room.log.push({ team: player.team, playerName: player.name, kind: "pass", result: "Passed" });
  room.turnTeam = otherTeam(player.team);
  room.askedThisTurn = false;
}

export function toggleCross(room: Room, playerId: string, token: string, characterId: string) {
  if (room.status !== "playing") throw new ApiError(400, "Game is not in progress.");
  const player = requirePlayer(room, playerId, token);
  if (player.team !== room.turnTeam) throw new ApiError(403, "Not your turn.");
  if (!characters.some((c) => c.id === characterId)) throw new ApiError(400, "Unknown character.");

  const crossed = player.team === "Red" ? room.redCrossed : room.blueCrossed;
  const idx = crossed.indexOf(characterId);
  if (idx === -1) crossed.push(characterId);
  else crossed.splice(idx, 1);
}

export function makeGuess(room: Room, playerId: string, token: string, characterId: string) {
  if (room.status !== "playing") throw new ApiError(400, "Game is not in progress.");
  const player = requirePlayer(room, playerId, token);
  if (player.team !== room.turnTeam) throw new ApiError(403, "Not your turn.");
  const guessed = characters.find((c) => c.id === characterId);
  if (!guessed) throw new ApiError(400, "Unknown character.");

  const eliminated = player.team === "Red" ? room.redEliminated : room.blueEliminated;
  const crossed = player.team === "Red" ? room.redCrossed : room.blueCrossed;
  const remainingCount = characters.filter((c) => !eliminated.includes(c.id) && !crossed.includes(c.id)).length;
  if (remainingCount !== 1) throw new ApiError(400, "You can only guess once you've narrowed it down to one character.");

  const opponent = otherTeam(player.team);
  const opponentSecretId = opponent === "Red" ? room.redSecretId : room.blueSecretId;
  const correct = characterId === opponentSecretId;

  room.log.push({ team: player.team, playerName: player.name, kind: "guess", characterId, result: correct ? "Correct!" : "Wrong" });

  room.status = "finished";
  room.winner = correct ? player.team : opponent;
}

export function restartGame(room: Room, playerId: string, token: string) {
  requirePlayer(room, playerId, token);
  if (room.status !== "finished") throw new ApiError(400, "Game is not finished yet.");
  room.status = "picking";
  room.redSecretId = undefined;
  room.blueSecretId = undefined;
  room.redEliminated = [];
  room.blueEliminated = [];
  room.redCrossed = [];
  room.blueCrossed = [];
  room.log = [];
  room.winner = undefined;
  room.turnTeam = "Red";
  room.askedThisTurn = false;
}

export function leaveRoom(room: Room, playerId: string, token: string) {
  requirePlayer(room, playerId, token);
  room.players = room.players.filter((p) => p.id !== playerId);

  if (room.status === "playing" || room.status === "picking") {
    const redCount = room.players.filter((p) => p.team === "Red").length;
    const blueCount = room.players.filter((p) => p.team === "Blue").length;
    if (redCount === 0 && blueCount > 0) {
      room.status = "finished";
      room.winner = "Blue";
    } else if (blueCount === 0 && redCount > 0) {
      room.status = "finished";
      room.winner = "Red";
    }
  }
}

export function publicRoom(room: Room, viewerTeam?: Team) {
  const finished = room.status === "finished";
  return {
    code: room.code,
    status: room.status,
    players: room.players.map((p) => ({ id: p.id, name: p.name, team: p.team })),
    turnTeam: room.turnTeam,
    askedThisTurn: room.askedThisTurn,
    log: room.log,
    winner: room.winner,
    redPicked: !!room.redSecretId,
    bluePicked: !!room.blueSecretId,
    redEliminated: room.redEliminated,
    blueEliminated: room.blueEliminated,
    redCrossed: room.redCrossed,
    blueCrossed: room.blueCrossed,
    mySecret: viewerTeam ? charInfo(viewerTeam === "Red" ? room.redSecretId : room.blueSecretId) ?? null : null,
    reveal: finished ? { red: charInfo(room.redSecretId), blue: charInfo(room.blueSecretId) } : undefined,
  };
}
