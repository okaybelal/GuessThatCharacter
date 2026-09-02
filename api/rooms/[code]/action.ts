import { withRoom } from "../../_db.js";
import {
  joinRoom,
  switchTeam,
  choosePack,
  startGame,
  pickCharacter,
  askQuestion,
  passTurn,
  toggleCross,
  makeGuess,
  restartGame,
  leaveRoom,
  publicRoom,
} from "../../_game.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const code = String(req.query.code || "").toUpperCase();
  const body = req.body || {};
  const { action, playerId, token } = body;

  try {
    let joinedPlayerId = "";
    let joinedToken = "";

    const room = await withRoom(code, (r) => {
      switch (action) {
        case "join": {
          const joined = joinRoom(r, body.name);
          joinedPlayerId = joined.playerId;
          joinedToken = joined.token;
          break;
        }
        case "team":
          switchTeam(r, playerId, token, body.team);
          break;
        case "pack":
          choosePack(r, playerId, token, body.packKey);
          break;
        case "start":
          startGame(r, playerId, token);
          break;
        case "pick":
          pickCharacter(r, playerId, token, body.characterId);
          break;
        case "question":
          askQuestion(r, playerId, token, body.categoryKey, body.value);
          break;
        case "pass":
          passTurn(r, playerId, token);
          break;
        case "cross":
          toggleCross(r, playerId, token, body.characterId);
          break;
        case "guess":
          makeGuess(r, playerId, token, body.characterId);
          break;
        case "restart":
          restartGame(r, playerId, token);
          break;
        case "leave":
          leaveRoom(r, playerId, token);
          break;
        default:
          throw Object.assign(new Error("Unknown action."), { status: 400 });
      }
    });

    if (!room) {
      res.status(404).json({ error: "Room not found." });
      return;
    }

    const effectivePlayerId = action === "join" ? joinedPlayerId : playerId;
    const viewerTeam = room.players.find((p) => p.id === effectivePlayerId)?.team;

    const responseBody: any = { room: publicRoom(room, viewerTeam) };
    if (action === "join") {
      responseBody.playerId = joinedPlayerId;
      responseBody.token = joinedToken;
    }
    res.status(200).json(responseBody);
  } catch (e: any) {
    res.status(e.status || 500).json({ error: e.message || "Internal error" });
  }
}
