import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { HubUser, UserRole } from "./client-platform-types";
import { createToken, parseSessionCookie, signSessionCookie, verifyPassword } from "./auth-crypto";
import {
  appendSecurityEvent,
  createSession,
  findAuthUserByEmail,
  getValidSessionUser,
  revokeSession,
} from "./auth-store";

const SESSION_COOKIE = "lysma_hub_session";

const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 8,
};

export const getCurrentUser = async (): Promise<HubUser | null> => {
  const cookieStore = await cookies();
  const parsed = await parseSessionCookie(cookieStore.get(SESSION_COOKIE)?.value);

  if (!parsed) {
    return null;
  }

  return getValidSessionUser(parsed.sessionId, parsed.rawToken);
};

export const requireAuth = async (allowedRoles?: UserRole[]) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    redirect("/login");
  }

  return user;
};

export const requireClientSiteAccess = async (siteSlug: string) => {
  const user = await requireAuth();

  if (user.role === "admin") {
    return user;
  }

  if (user.siteSlug !== siteSlug) {
    redirect("/dashboard");
  }

  return user;
};

export const startAuthenticatedSession = async (email: string, password: string) => {
  const user = await findAuthUserByEmail(email);

  if (!user) {
    await appendSecurityEvent("login_failed", null, email);
    return { ok: false, message: "Email ou mot de passe incorrect." };
  }

  const passwordValid = await verifyPassword(password, user.passwordHash);

  if (!passwordValid) {
    await appendSecurityEvent("login_failed", user.id, user.email);
    return { ok: false, message: "Email ou mot de passe incorrect." };
  }

  if (!user.emailVerifiedAt) {
    return { ok: false, message: "Vous devez valider votre email avant de vous connecter." };
  }

  const rawToken = createToken();
  const session = await createSession(user.id, rawToken);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, await signSessionCookie(session.id, rawToken), sessionCookieOptions);
  await appendSecurityEvent("login_success", user.id, user.email);

  return { ok: true, message: "Connexion reussie." };
};

export const endAuthenticatedSession = async () => {
  const cookieStore = await cookies();
  const parsed = await parseSessionCookie(cookieStore.get(SESSION_COOKIE)?.value);

  if (parsed) {
    await revokeSession(parsed.sessionId);
  }

  cookieStore.delete(SESSION_COOKIE);
};

export const sessionCookieName = SESSION_COOKIE;
