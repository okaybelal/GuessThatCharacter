import { getRoomRow } from "../_db.js";
import { publicRoom } from "../_game.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const code = String(req.query.code || "").toUpperCase();
  const existing = await getRoomRow(code);
  if (!existing) {
    res.status(404).json({ error: "Room not found." });
    return;
  }
  res.status(200).json({ room: publicRoom(existing.room) });
}
