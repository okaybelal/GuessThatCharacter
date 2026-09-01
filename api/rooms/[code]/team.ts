import { withRoom } from "../../_db.js";
import { switchTeam, publicRoom } from "../../_game.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const code = String(req.query.code || "").toUpperCase();
  const { playerId, team } = req.body || {};
  try {
    const room = await withRoom(code, (r) => {
      switchTeam(r, playerId, team);
    });
    if (!room) {
      res.status(404).json({ error: "Room not found." });
      return;
    }
    res.status(200).json({ room: publicRoom(room) });
  } catch (e: any) {
    res.status(e.status || 500).json({ error: e.message || "Internal error" });
  }
}
