import { signInWithGoogle, requireUser, signOut } from "./_auth.js";
import { touchLastSeen, publicUser } from "./_userdb.js";

export default async function handler(req: any, res: any) {
  try {
    if (req.method === "GET") {
      const user = await requireUser(String(req.query.token || ""));
      await touchLastSeen(user.id);
      res.status(200).json({ user: publicUser(user) });
      return;
    }

    if (req.method === "POST") {
      const body = req.body || {};
      switch (body.action) {
        case "signin": {
          const { user, token } = await signInWithGoogle(body.idToken);
          res.status(200).json({ user, token });
          return;
        }
        case "logout": {
          await signOut(body.token);
          res.status(200).json({ ok: true });
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
