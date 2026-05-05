import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE_NAME = "pma_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 jours
const LAST_SEEN_THROTTLE_MS = 5 * 60 * 1000; // update last_seen_at max toutes les 5 min

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function generateSessionToken() {
  return randomBytes(32).toString("hex");
}

export async function createUserSession(params: {
  userId:         string;
  distributorId:  string;
  distributorSlug:string;
  roleCode:       string;
  userAgent?:     string | null;
  ipAddress?:     string | null;
}) {
  const token     = generateSessionToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.auth_sessions.create({
    data: {
      distributor_id:      params.distributorId,
      user_id:             params.userId,
      actor_type:          "user",
      session_token_hash:  tokenHash,
      expires_at:          expiresAt,
      user_agent:          params.userAgent  ?? null,
      ip_address:          params.ipAddress  ?? null,
      is_active:           true,
      last_seen_at:        new Date(),
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    path:     "/",
    expires:  expiresAt,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    path:     "/",
    expires:  new Date(0),
  });
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const tokenHash = hashToken(token);

  const session = await prisma.auth_sessions.findFirst({
    where: {
      session_token_hash: tokenHash,
      is_active:          true,
      revoked_at:         null,
      expires_at:         { gt: new Date() },
      user_id:            { not: null },
    },
    include: {
      users: {
        include: {
          roles:        true,
          distributors: true,
        },
      },
    },
  });

  if (!session || !session.users || !session.users.is_active) return null;

  // Throttle last_seen_at — écriture max toutes les 5 min
  const lastSeen = session.last_seen_at?.getTime() ?? 0;
  if (Date.now() - lastSeen > LAST_SEEN_THROTTLE_MS) {
    prisma.auth_sessions.update({
      where: { id: session.id },
      data:  { last_seen_at: new Date() },
    }).catch(() => {}); // fire & forget, non bloquant
  }

  return {
    sessionId: session.id,
    user: {
      id:              session.users.id,
      email:           session.users.email,
      firstName:       session.users.first_name,
      lastName:        session.users.last_name,
      distributorId:   session.users.distributor_id,
      distributorSlug: session.users.distributors.slug,
      roleCode:        session.users.roles.code,
      roleLabel:       session.users.roles.label,
      mustChangePassword: session.users.must_change_password,
    },
  };
}

export async function requireUser() {
  const session = await getCurrentSession();
  if (!session) redirect("/login?error=session_required");
  return session.user;
}

export async function revokeCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    const tokenHash = hashToken(token);
    await prisma.auth_sessions.updateMany({
      where: { session_token_hash: tokenHash, is_active: true },
      data:  { is_active: false, revoked_at: new Date() },
    }).catch(() => {});
  }

  await clearSessionCookie();
}

/** Révoque toutes les sessions actives d'un utilisateur (ex: changement de mot de passe) */
export async function revokeAllUserSessions(userId: string) {
  await prisma.auth_sessions.updateMany({
    where: { user_id: userId, is_active: true },
    data:  { is_active: false, revoked_at: new Date() },
  });
}