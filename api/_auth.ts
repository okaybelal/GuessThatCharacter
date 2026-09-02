import { OAuth2Client } from "google-auth-library";
import {
  findUserByGoogleSub,
  createUser,
  generateUniqueUsername,
  touchLastSeen,
  createSession,
  findSessionUser,
  deleteSession,
  publicUser,
  type UserRow,
  type PublicUser,
} from "./_userdb.js";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyGoogleIdToken(idToken: string): Promise<{ sub: string; email: string; name: string; picture: string | null }> {
  if (!idToken) throw new ApiError(400, "Missing Google credential.");
  let ticket;
  try {
    ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
  } catch {
    throw new ApiError(401, "Invalid Google credential.");
  }
  const payload = ticket.getPayload();
  if (!payload?.sub || !payload.email) throw new ApiError(401, "Invalid Google credential.");
  return { sub: payload.sub, email: payload.email, name: payload.name || payload.email.split("@")[0], picture: payload.picture ?? null };
}

export async function signInWithGoogle(idToken: string): Promise<{ user: PublicUser; token: string }> {
  const { sub, email, name, picture } = await verifyGoogleIdToken(idToken);
  let user: UserRow | null = await findUserByGoogleSub(sub);
  if (!user) {
    const username = await generateUniqueUsername(name);
    user = await createUser({ googleSub: sub, email, name, username, avatarUrl: picture });
  }
  await touchLastSeen(user.id);
  const token = await createSession(user.id);
  return { user: publicUser(user), token };
}

export async function requireUser(token: string | undefined | null): Promise<UserRow> {
  if (!token) throw new ApiError(401, "Not signed in.");
  const user = await findSessionUser(token);
  if (!user) throw new ApiError(401, "Session expired. Please sign in again.");
  return user;
}

export async function signOut(token: string): Promise<void> {
  if (token) await deleteSession(token);
}
