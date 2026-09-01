import { createRoom, publicRoom } from "./_game.js";
import { insertRoomRow } from "./_db.js";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const { name } = req.body || {};
    let lastError: any;
    for (let attempt = 0; attempt < 5; attempt++) {
      const { room, playerId, token } = createRoom(name);
      try {
        await insertRoomRow(room);
        res.status(200).json({ playerId, token, room: publicRoom(room, "Red") });
        return;
      } catch (e: any) {
        if (e?.code === "23505") {
          lastError = e;
          continue;
        }
        throw e;
      }
    }
    throw lastError || new Error("Could not create room.");
  } catch (e: any) {
    res.status(e.status || 500).json({ error: e.message || "Internal error" });
  }
}
