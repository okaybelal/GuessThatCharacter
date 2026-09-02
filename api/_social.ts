import { ApiError } from "./_auth.js";
import {
  findUserByUsername,
  findFriendRequestBetween,
  createFriendRequest,
  findFriendRequestById,
  setFriendRequestStatus,
  deleteFriendship,
  listFriends,
  listIncomingRequests,
  areFriends,
  createInvite,
  listPendingInvites,
  findInviteById,
  setInviteStatus,
  publicUser,
  isOnline,
  type UserRow,
  type PublicUser,
} from "./_userdb.js";

export async function searchUsername(username: string): Promise<PublicUser | null> {
  const found = await findUserByUsername(String(username || "").trim());
  return found ? publicUser(found) : null;
}

export async function sendFriendRequest(me: UserRow, toUsername: string): Promise<void> {
  const target = await findUserByUsername(String(toUsername || "").trim());
  if (!target) throw new ApiError(404, "No user with that username.");
  if (target.id === me.id) throw new ApiError(400, "You can't friend yourself.");

  const existing = await findFriendRequestBetween(me.id, target.id);
  if (existing) {
    if (existing.status === "accepted") throw new ApiError(400, "You're already friends.");
    if (existing.status === "pending") throw new ApiError(400, "A friend request is already pending.");
    // declined: allow re-requesting by deleting the old row first
    await deleteFriendship(me.id, target.id);
  }
  await createFriendRequest(me.id, target.id);
}

export async function respondFriendRequest(me: UserRow, requestId: string, accept: boolean): Promise<void> {
  const request = await findFriendRequestById(requestId);
  if (!request || request.to_user_id !== me.id) throw new ApiError(404, "Friend request not found.");
  if (request.status !== "pending") throw new ApiError(400, "This request was already handled.");
  await setFriendRequestStatus(requestId, accept ? "accepted" : "declined");
}

export async function removeFriend(me: UserRow, friendId: string): Promise<void> {
  await deleteFriendship(me.id, friendId);
}

export async function sendInvite(me: UserRow, toUserId: string, roomCode: string): Promise<void> {
  if (!roomCode) throw new ApiError(400, "Missing room code.");
  const friends = await areFriends(me.id, toUserId);
  if (!friends) throw new ApiError(403, "You can only invite friends.");
  await createInvite(me.id, toUserId, roomCode.toUpperCase());
}

export async function respondInvite(me: UserRow, inviteId: string, accept: boolean): Promise<string | null> {
  const invite = await findInviteById(inviteId);
  if (!invite || invite.to_user_id !== me.id) throw new ApiError(404, "Invite not found.");
  if (invite.status !== "pending") throw new ApiError(400, "This invite is no longer valid.");
  await setInviteStatus(inviteId, accept ? "accepted" : "declined");
  return accept ? invite.room_code : null;
}

export async function socialState(me: UserRow) {
  const [friends, incomingRequests, pendingInvites] = await Promise.all([
    listFriends(me.id),
    listIncomingRequests(me.id),
    listPendingInvites(me.id),
  ]);
  return {
    me: { ...publicUser(me), online: isOnline(me) },
    friends,
    incomingRequests,
    pendingInvites,
  };
}
