import { neon } from "@neondatabase/serverless";
import type { Room } from "./_game.js";

const sql = neon(process.env.DATABASE_URL!);

export async function getRoomRow(code: string): Promise<{ room: Room; version: number } | null> {
  const rows = await sql`SELECT data, version FROM rooms WHERE code = ${code}`;
  if (rows.length === 0) return null;
  return { room: rows[0].data as Room, version: rows[0].version as number };
}

export async function insertRoomRow(room: Room) {
  try {
    await sql`INSERT INTO rooms (code, data, version) VALUES (${room.code}, ${JSON.stringify(room)}::jsonb, 0)`;
  } catch (e: any) {
    if (e?.code === "23505") {
      const err: any = new Error("Room code already exists.");
      err.code = "23505";
      throw err;
    }
    throw e;
  }
}

async function updateRoomRow(code: string, room: Room, expectedVersion: number): Promise<boolean> {
  const rows = await sql`
    UPDATE rooms SET data = ${JSON.stringify(room)}::jsonb, version = version + 1, updated_at = now()
    WHERE code = ${code} AND version = ${expectedVersion}
    RETURNING version
  `;
  return rows.length > 0;
}

export async function withRoom(code: string, mutate: (room: Room) => void): Promise<Room | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const existing = await getRoomRow(code);
    if (!existing) return null;
    const { room, version } = existing;
    mutate(room);
    const ok = await updateRoomRow(code, room, version);
    if (ok) return room;
  }
  throw new Error("Could not save room changes, please try again.");
}
