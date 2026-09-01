import { WebSocketServer, WebSocket } from "ws";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { characters } from "../src/characters";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

type Team = "Red" | "Blue";

interface Player {
  id: string;
  name: string;
  team: Team;
  ws: WebSocket;
}

interface LogEntry {
  team: Team;
  playerName: string;
  kind: "question" | "guess";
  key?: string;
  characterId?: string;
  result: string;
}

interface Room {
  code: string;
  status: "lobby" | "playing" | "finished";
  players: Player[];
  secretId: string;
  eliminated: Set<string>;
  turnTeam: Team;
  log: LogEntry[];
  winner?: Team;
}

const rooms = new Map<string, Room>();

function roomIsReady(room: Room) {
  const red = room.players.filter((p) => p.team === "Red").length;
  const blue = room.players.filter((p) => p.team === "Blue").length;
  return red >= 1 && blue >= 1;
}

function pickTeam(room: Room): Team {
  const red = room.players.filter((p) => p.team === "Red").length;
  const blue = room.players.filter((p) => p.team === "Blue").length;
  return red <= blue ? "Red" : "Blue";
}

function genCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function publicRoom(room: Room) {
  return {
    code: room.code,
    status: room.status,
    players: room.players.map((p) => ({ id: p.id, name: p.name, team: p.team })),
    eliminated: [...room.eliminated],
    turnTeam: room.turnTeam,
    log: room.log,
    winner: room.winner,
    secretName: room.status === "finished" ? characters.find((c) => c.id === room.secretId)?.name : undefined,
    secretSource: room.status === "finished" ? characters.find((c) => c.id === room.secretId)?.source : undefined,
  };
}

function broadcast(room: Room) {
  const payload = JSON.stringify({ type: "room_update", room: publicRoom(room) });
  room.players.forEach((p) => {
    if (p.ws.readyState === WebSocket.OPEN) p.ws.send(payload);
  });
}

function send(ws: WebSocket, data: unknown) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
}

const httpServer = http.createServer((req, res) => {
  const url = new URL(req.url || "/", "http://localhost");
  let filePath = path.join(distDir, url.pathname === "/" ? "index.html" : url.pathname);

  if (!filePath.startsWith(distDir)) {
    res.writeHead(403);
    res.end();
    return;
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, "index.html");
  }

  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    res.end(data);
  });
});

const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (ws: WebSocket) => {
  let currentRoomCode: string | null = null;
  let playerId = Math.random().toString(36).slice(2, 10);

  ws.on("message", (raw) => {
    let msg: any;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    if (msg.type === "create_room") {
      const code = genCode();
      const room: Room = {
        code,
        status: "lobby",
        players: [],
        secretId: characters[Math.floor(Math.random() * characters.length)].id,
        eliminated: new Set(),
        turnTeam: "Red",
        log: [],
      };
      const player: Player = { id: playerId, name: String(msg.name || "Player").slice(0, 20), team: "Red", ws };
      room.players.push(player);
      rooms.set(code, room);
      currentRoomCode = code;
      send(ws, { type: "joined", playerId, room: publicRoom(room) });
      broadcast(room);
      return;
    }

    if (msg.type === "join_room") {
      const room = rooms.get(String(msg.code || "").toUpperCase());
      if (!room) {
        send(ws, { type: "error", message: "Room not found." });
        return;
      }
      if (room.status !== "lobby") {
        send(ws, { type: "error", message: "Game already in progress." });
        return;
      }
      const player: Player = { id: playerId, name: String(msg.name || "Player").slice(0, 20), team: pickTeam(room), ws };
      room.players.push(player);
      currentRoomCode = room.code;
      send(ws, { type: "joined", playerId, room: publicRoom(room) });
      broadcast(room);
      return;
    }

    if (msg.type === "switch_team") {
      const room = rooms.get(currentRoomCode || "");
      if (!room || room.status !== "lobby") return;
      const player = room.players.find((p) => p.id === playerId);
      if (!player) return;
      const target: Team = msg.team === "Blue" ? "Blue" : "Red";
      player.team = target;
      broadcast(room);
      return;
    }

    if (msg.type === "start_game") {
      const room = rooms.get(currentRoomCode || "");
      if (!room) return;
      if (!roomIsReady(room)) {
        send(ws, { type: "error", message: "Need at least one player on each team." });
        return;
      }
      room.status = "playing";
      broadcast(room);
      return;
    }

    if (msg.type === "ask_question") {
      const room = rooms.get(currentRoomCode || "");
      if (!room || room.status !== "playing") return;
      const player = room.players.find((p) => p.id === playerId);
      if (!player || player.team !== room.turnTeam) return;
      const key = msg.key as string;
      const secret = characters.find((c) => c.id === room.secretId)!;
      const answer = (secret.attributes as any)[key];
      if (answer === undefined) return;
      characters.forEach((c) => {
        if (room.eliminated.has(c.id)) return;
        if ((c.attributes as any)[key] !== answer) room.eliminated.add(c.id);
      });
      room.log.push({
        team: player.team,
        playerName: player.name,
        kind: "question",
        key,
        result: answer ? "Yes" : "No",
      });
      room.turnTeam = room.turnTeam === "Red" ? "Blue" : "Red";
      broadcast(room);
      return;
    }

    if (msg.type === "guess") {
      const room = rooms.get(currentRoomCode || "");
      if (!room || room.status !== "playing") return;
      const player = room.players.find((p) => p.id === playerId);
      if (!player || player.team !== room.turnTeam) return;
      const characterId = msg.characterId as string;
      const guessed = characters.find((c) => c.id === characterId);
      if (!guessed) return;
      const correct = characterId === room.secretId;
      room.log.push({
        team: player.team,
        playerName: player.name,
        kind: "guess",
        characterId,
        result: correct ? "Correct!" : "Wrong",
      });
      if (correct) {
        room.status = "finished";
        room.winner = player.team;
      } else {
        room.eliminated.add(characterId);
        room.turnTeam = room.turnTeam === "Red" ? "Blue" : "Red";
      }
      broadcast(room);
      return;
    }

    if (msg.type === "leave_room") {
      const room = rooms.get(currentRoomCode || "");
      if (!room) return;
      room.players = room.players.filter((p) => p.id !== playerId);
      if (room.players.length === 0) rooms.delete(room.code);
      else broadcast(room);
      currentRoomCode = null;
      return;
    }
  });

  ws.on("close", () => {
    const room = rooms.get(currentRoomCode || "");
    if (!room) return;
    room.players = room.players.filter((p) => p.id !== playerId);
    if (room.players.length === 0) rooms.delete(room.code);
    else broadcast(room);
  });
});

const PORT = Number(process.env.PORT) || 8787;
httpServer.listen(PORT, () => {
  console.log(`Guess That Character server listening on http://localhost:${PORT}`);
});
