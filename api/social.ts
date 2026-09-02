import { requireUser } from "./_auth.js";
import {
  searchUsername,
  sendFriendRequest,
  respondFriendRequest,
  removeFriend,
  sendInvite,
  respondInvite,
  socialState,
} from "./_social.js";
import { touchLastSeen } from "./_userdb.js";

export default async function handler(req: any, res: any) {
  try {
    if (req.method === "GET") {
      const user = await requireUser(String(req.query.token || ""));
      await touchLastSeen(user.id);
      res.status(200).json(await socialState(user));
      return;
    }

    if (req.method === "POST") {
      const body = req.body || {};
      const user = await requireUser(body.token);

      switch (body.action) {
        case "search-username": {
          const found = await searchUsername(body.username);
          res.status(200).json({ user: found });
          return;
        }
        case "send-friend-request": {
          await sendFriendRequest(user, body.username);
          res.status(200).json(await socialState(user));
          return;
        }
        case "respond-friend-request": {
          await respondFriendRequest(user, body.requestId, !!body.accept);
          res.status(200).json(await socialState(user));
          return;
        }
        case "remove-friend": {
          await removeFriend(user, body.friendId);
          res.status(200).json(await socialState(user));
          return;
        }
        case "send-invite": {
          await sendInvite(user, body.toUserId, body.roomCode);
          res.status(200).json({ ok: true });
          return;
        }
        case "respond-invite": {
          const roomCode = await respondInvite(user, body.inviteId, !!body.accept);
          res.status(200).json({ roomCode, ...(await socialState(user)) });
          return;
        }
        default:
          res.status(400).json({ error: "Unknown action." });
          return;
      }
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    res.status(e.status || 500).json({ error: e.message || "Internal error" });
  }
}
