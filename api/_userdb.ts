import { neon } from "@neondatabase/serverless";
import crypto from "node:crypto";

const sql = neon(process.env.DATABASE_URL!);

const ONLINE_THRESHOLD_SECONDS = 90;

export interface UserRow {
  id: string;
  google_sub: string;
  email: string;
  name: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
  last_seen_at: string;
}

export interface PublicUser {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
}

export function publicUser(u: UserRow): PublicUser {
  return { id: u.id, name: u.name, username: u.username, avatarUrl: u.avatar_url };
}

export async function findUserByGoogleSub(sub: string): Promise<UserRow | null> {
  const rows = await sql`SELECT * FROM users WHERE google_sub = ${sub}`;
  return (rows[0] as UserRow) ?? null;
}

export async function findUserById(id: string): Promise<UserRow | null> {
  const rows = await sql`SELECT * FROM users WHERE id = ${id}`;
  return (rows[0] as UserRow) ?? null;
}

export async function findUserByUsername(username: string): Promise<UserRow | null> {
  const rows = await sql`SELECT * FROM users WHERE lower(username) = lower(${username})`;
  return (rows[0] as UserRow) ?? null;
}

async function usernameTaken(username: string): Promise<boolean> {
  const rows = await sql`SELECT 1 FROM users WHERE lower(username) = lower(${username})`;
  return rows.length > 0;
}

export async function generateUniqueUsername(seed: string): Promise<string> {
  const base = seed
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 20) || "player";
  let candidate = base;
  let suffix = 0;
  while (await usernameTaken(candidate)) {
    suffix += 1;
    candidate = `${base}${suffix}`;
  }
  return candidate;
}

export async function createUser(params: { googleSub: string; email: string; name: string; username: string; avatarUrl: string | null }): Promise<UserRow> {
  const rows = await sql`
    INSERT INTO users (google_sub, email, name, username, avatar_url)
    VALUES (${params.googleSub}, ${params.email}, ${params.name}, ${params.username}, ${params.avatarUrl})
    RETURNING *
  `;
  return rows[0] as UserRow;
}

export async function touchLastSeen(userId: string): Promise<void> {
  await sql`UPDATE users SET last_seen_at = now() WHERE id = ${userId}`;
}

export function isOnline(u: { last_seen_at: string }): boolean {
  return Date.now() - new Date(u.last_seen_at).getTime() < ONLINE_THRESHOLD_SECONDS * 1000;
}

// --- sessions ---

export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  await sql`INSERT INTO sessions (token, user_id) VALUES (${token}, ${userId})`;
  return token;
}

export async function findSessionUser(token: string): Promise<UserRow | null> {
  const rows = await sql`
    SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ${token}
  `;
  return (rows[0] as UserRow) ?? null;
}

export async function deleteSession(token: string): Promise<void> {
  await sql`DELETE FROM sessions WHERE token = ${token}`;
}

// --- friend requests ---

export interface FriendRequestRow {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
}

export async function findFriendRequestBetween(userA: string, userB: string): Promise<FriendRequestRow | null> {
  const rows = await sql`
    SELECT * FROM friend_requests
    WHERE (from_user_id = ${userA} AND to_user_id = ${userB})
       OR (from_user_id = ${userB} AND to_user_id = ${userA})
  `;
  return (rows[0] as FriendRequestRow) ?? null;
}

export async function createFriendRequest(fromUserId: string, toUserId: string): Promise<FriendRequestRow> {
  const rows = await sql`
    INSERT INTO friend_requests (from_user_id, to_user_id) VALUES (${fromUserId}, ${toUserId})
    RETURNING *
  `;
  return rows[0] as FriendRequestRow;
}

export async function findFriendRequestById(id: string): Promise<FriendRequestRow | null> {
  const rows = await sql`SELECT * FROM friend_requests WHERE id = ${id}`;
  return (rows[0] as FriendRequestRow) ?? null;
}

export async function setFriendRequestStatus(id: string, status: "accepted" | "declined"): Promise<void> {
  await sql`UPDATE friend_requests SET status = ${status}, updated_at = now() WHERE id = ${id}`;
}

export async function deleteFriendship(userA: string, userB: string): Promise<void> {
  await sql`
    DELETE FROM friend_requests
    WHERE (from_user_id = ${userA} AND to_user_id = ${userB})
       OR (from_user_id = ${userB} AND to_user_id = ${userA})
  `;
}

export interface FriendView extends PublicUser {
  online: boolean;
}

export async function listFriends(userId: string): Promise<FriendView[]> {
  const rows = await sql`
    SELECT u.* FROM friend_requests fr
    JOIN users u ON u.id = CASE WHEN fr.from_user_id = ${userId} THEN fr.to_user_id ELSE fr.from_user_id END
    WHERE fr.status = 'accepted' AND (fr.from_user_id = ${userId} OR fr.to_user_id = ${userId})
    ORDER BY u.name ASC
  `;
  return (rows as UserRow[]).map((u) => ({ ...publicUser(u), online: isOnline(u) }));
}

export interface IncomingRequestView {
  id: string;
  from: PublicUser;
}

export async function listIncomingRequests(userId: string): Promise<IncomingRequestView[]> {
  const rows = await sql`
    SELECT fr.id AS request_id, u.* FROM friend_requests fr
    JOIN users u ON u.id = fr.from_user_id
    WHERE fr.to_user_id = ${userId} AND fr.status = 'pending'
    ORDER BY fr.created_at DESC
  `;
  return (rows as (UserRow & { request_id: string })[]).map((r) => ({ id: r.request_id, from: publicUser(r) }));
}

export async function areFriends(userA: string, userB: string): Promise<boolean> {
  const req = await findFriendRequestBetween(userA, userB);
  return req?.status === "accepted";
}

// --- invites ---

export interface InviteRow {
  id: string;
  from_user_id: string;
  to_user_id: string;
  room_code: string;
  status: "pending" | "accepted" | "declined" | "expired";
  created_at: string;
}

export async function createInvite(fromUserId: string, toUserId: string, roomCode: string): Promise<InviteRow> {
  const rows = await sql`
    INSERT INTO invites (from_user_id, to_user_id, room_code) VALUES (${fromUserId}, ${toUserId}, ${roomCode})
    RETURNING *
  `;
  return rows[0] as InviteRow;
}

export interface PendingInviteView {
  id: string;
  from: PublicUser;
  roomCode: string;
}

export async function listPendingInvites(userId: string): Promise<PendingInviteView[]> {
  const rows = await sql`
    SELECT inv.id AS invite_id, inv.room_code, u.* FROM invites inv
    JOIN users u ON u.id = inv.from_user_id
    WHERE inv.to_user_id = ${userId} AND inv.status = 'pending'
    ORDER BY inv.created_at DESC
  `;
  return (rows as (UserRow & { invite_id: string; room_code: string })[]).map((r) => ({ id: r.invite_id, from: publicUser(r), roomCode: r.room_code }));
}

export async function findInviteById(id: string): Promise<InviteRow | null> {
  const rows = await sql`SELECT * FROM invites WHERE id = ${id}`;
  return (rows[0] as InviteRow) ?? null;
}

export async function setInviteStatus(id: string, status: "accepted" | "declined"): Promise<void> {
  await sql`UPDATE invites SET status = ${status} WHERE id = ${id}`;
}
