import { withRoom } from "../../_db.js";
import { askQuestion, publicRoom } from "../../_game.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const code = String(req.query.code || "").toUpperCase();
  const { playerId, key } = req.body || {};
  try {
    const room = await withRoom(code, (r) => {
      askQuestion(r, playerId, key);
    });
    if (!room) {
      res.status(404).json({ error: "Room not found." });
      return;
    }
    const viewerTeam = room.players.find((p) => p.id === playerId)?.team;
    res.status(200).json({ room: publicRoom(room, viewerTeam) });
  } catch (e: any) {
    res.status(e.status || 500).json({ error: e.message || "Internal error" });
  }
}
