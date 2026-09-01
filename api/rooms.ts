import { createRoom, publicRoom } from "./_game.js";
import { insertRoomRow } from "./_db.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const { name } = req.body || {};
    const { room, playerId } = createRoom(name);
    await insertRoomRow(room);
    res.status(200).json({ playerId, room: publicRoom(room) });
  } catch (e: any) {
    res.status(e.status || 500).json({ error: e.message || "Internal error" });
  }
}
