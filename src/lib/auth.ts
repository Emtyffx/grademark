import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { Schema } from "mongoose";
import Session from "./models/Session";
import { IUser } from "./models/User";
import { sha256 } from "@oslojs/crypto/sha2";
import { cookies } from "next/headers";
import { cache } from "react";

export function generateToken() {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

export function hash(str: string) {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(str)));
}

export async function createSession(
  token: string,
  userId: Schema.Types.ObjectId,
) {
  try {
    const newSession = new Session({
      token: hash(token),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      user: userId,
    });
    await newSession.save();
    return newSession;
  } catch (e) {
    console.error("Internal error: ", e);
  }
}

export async function validateToken(token: string) {
  const session = await Session.findOne({ token: hash(token) }).populate<{
    user: IUser;
  }>("user");
  if (!session) return null;

  if (Date.now() >= session.expiresAt.getTime()) {
    await Session.findByIdAndDelete(session.id);
    return null;
  }
  // ensure preservation of the active sessions
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await session.save();
  }

  return session;
}

export async function invalidateOne(sessionId: Schema.Types.ObjectId) {
  return Session.findByIdAndDelete(sessionId);
}

export async function invalidateAll(userId: Schema.Types.ObjectId) {
  return Session.deleteMany({ user: userId });
}

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date,
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

export const getCurrentSession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value ?? null;
  if (token === null) {
    return null;
  }
  const result = await validateToken(token);
  return result;
});
