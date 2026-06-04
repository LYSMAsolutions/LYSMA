import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { demoHubUsers } from "../data/client-platform-demo";
import type { HubUser } from "./client-platform-types";
import { createToken, hashPassword, sha256 } from "./auth-crypto";
import type {
  AuthSessionRecord,
  AuthStoreData,
  AuthTokenPurpose,
  AuthTokenRecord,
  AuthUserRecord,
  SecurityEventRecord,
} from "./auth-types";

const STORE_PATH = path.join(process.cwd(), ".next", "lysma-hub-auth-store.json");
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;
const EMAIL_TOKEN_TTL_MS = 1000 * 60 * 60 * 24;
const RESET_TOKEN_TTL_MS = 1000 * 60 * 30;

const emptyStore = (): AuthStoreData => ({
  users: [],
  sessions: [],
  tokens: [],
  securityEvents: [],
});

const nowIso = () => new Date().toISOString();

const toHubUser = (user: AuthUserRecord): HubUser => ({
  id: user.id,
  email: user.email,
  role: user.role,
  siteSlug: user.siteSlug,
  createdAt: user.createdAt,
});

const ensureSeedUsers = async (store: AuthStoreData) => {
  let changed = false;

  for (const demoUser of demoHubUsers) {
    const exists = store.users.some((user) => user.email === demoUser.email.toLowerCase());

    if (!exists) {
      const createdAt = demoUser.createdAt;
      store.users.push({
        id: demoUser.id,
        email: demoUser.email.toLowerCase(),
        passwordHash: await hashPassword("LysmaDemo2026!"),
        role: demoUser.role,
        siteSlug: demoUser.siteSlug,
        emailVerifiedAt: createdAt,
        createdAt,
        updatedAt: createdAt,
      });
      changed = true;
    }
  }

  return changed;
};

export const readAuthStore = async (): Promise<AuthStoreData> => {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const store = JSON.parse(raw) as AuthStoreData;
    const seeded = await ensureSeedUsers(store);

    if (seeded) {
      await writeAuthStore(store);
    }

    return store;
  } catch {
    const store = emptyStore();
    await ensureSeedUsers(store);
    await writeAuthStore(store);
    return store;
  }
};

export const writeAuthStore = async (store: AuthStoreData) => {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
};

export const findAuthUserByEmail = async (email: string) => {
  const store = await readAuthStore();
  return store.users.find((user) => user.email === email.toLowerCase()) ?? null;
};

export const findAuthUserById = async (userId: string) => {
  const store = await readAuthStore();
  return store.users.find((user) => user.id === userId) ?? null;
};

export const getHubUserById = async (userId: string): Promise<HubUser | null> => {
  const user = await findAuthUserById(userId);
  return user ? toHubUser(user) : null;
};

export const getHubUserByEmail = async (email: string): Promise<HubUser | null> => {
  const user = await findAuthUserByEmail(email);
  return user ? toHubUser(user) : null;
};

export const createAuthUser = async ({
  email,
  password,
  siteSlug,
}: {
  email: string;
  password: string;
  siteSlug: string | null;
}) => {
  const store = await readAuthStore();
  const normalizedEmail = email.toLowerCase();

  if (store.users.some((user) => user.email === normalizedEmail)) {
    return null;
  }

  const timestamp = nowIso();
  const user: AuthUserRecord = {
    id: `usr_${createToken().slice(0, 18)}`,
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
    role: "client",
    siteSlug,
    emailVerifiedAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  store.users.push(user);
  store.securityEvents.push(createSecurityEvent("register", user.id, user.email));
  await writeAuthStore(store);

  return user;
};

export const createSecurityEvent = (
  type: SecurityEventRecord["type"],
  userId: string | null,
  email?: string,
): SecurityEventRecord => ({
  id: `evt_${createToken().slice(0, 18)}`,
  userId,
  type,
  email,
  createdAt: nowIso(),
});

export const appendSecurityEvent = async (
  type: SecurityEventRecord["type"],
  userId: string | null,
  email?: string,
) => {
  const store = await readAuthStore();
  store.securityEvents.push(createSecurityEvent(type, userId, email));
  await writeAuthStore(store);
};

export const createAuthToken = async (userId: string, purpose: AuthTokenPurpose) => {
  const store = await readAuthStore();
  const rawToken = createToken();
  const timestamp = Date.now();
  const token: AuthTokenRecord = {
    id: `tok_${createToken().slice(0, 18)}`,
    userId,
    tokenHash: await sha256(rawToken),
    purpose,
    createdAt: new Date(timestamp).toISOString(),
    expiresAt: new Date(timestamp + (purpose === "password_reset" ? RESET_TOKEN_TTL_MS : EMAIL_TOKEN_TTL_MS)).toISOString(),
    usedAt: null,
  };

  store.tokens.push(token);
  await writeAuthStore(store);

  return { rawToken, token };
};

export const consumeAuthToken = async (rawToken: string, purpose: AuthTokenPurpose) => {
  const store = await readAuthStore();
  const tokenHash = await sha256(rawToken);
  const token = store.tokens.find(
    (candidate) =>
      candidate.tokenHash === tokenHash &&
      candidate.purpose === purpose &&
      !candidate.usedAt &&
      new Date(candidate.expiresAt).getTime() > Date.now(),
  );

  if (!token) {
    return null;
  }

  token.usedAt = nowIso();

  if (purpose === "email_verification") {
    const user = store.users.find((candidate) => candidate.id === token.userId);

    if (user) {
      user.emailVerifiedAt = nowIso();
      user.updatedAt = nowIso();
      store.securityEvents.push(createSecurityEvent("email_verified", user.id, user.email));
    }
  }

  await writeAuthStore(store);

  return token;
};

export const updatePasswordWithToken = async (rawToken: string, newPassword: string) => {
  const store = await readAuthStore();
  const tokenHash = await sha256(rawToken);
  const token = store.tokens.find(
    (candidate) =>
      candidate.tokenHash === tokenHash &&
      candidate.purpose === "password_reset" &&
      !candidate.usedAt &&
      new Date(candidate.expiresAt).getTime() > Date.now(),
  );

  if (!token) {
    return null;
  }

  const user = store.users.find((candidate) => candidate.id === token.userId);

  if (!user) {
    return null;
  }

  token.usedAt = nowIso();
  user.passwordHash = await hashPassword(newPassword);
  user.updatedAt = nowIso();
  store.sessions = store.sessions.map((session) =>
    session.userId === user.id ? { ...session, revokedAt: session.revokedAt ?? nowIso() } : session,
  );
  store.securityEvents.push(createSecurityEvent("password_reset_completed", user.id, user.email));
  await writeAuthStore(store);

  return user;
};

export const createSession = async (userId: string, rawToken: string) => {
  const store = await readAuthStore();
  const timestamp = Date.now();
  const session: AuthSessionRecord = {
    id: `ses_${createToken().slice(0, 18)}`,
    userId,
    tokenHash: await sha256(rawToken),
    createdAt: new Date(timestamp).toISOString(),
    expiresAt: new Date(timestamp + SESSION_TTL_MS).toISOString(),
    revokedAt: null,
  };

  store.sessions.push(session);
  await writeAuthStore(store);

  return session;
};

export const getValidSessionUser = async (sessionId: string, rawToken: string) => {
  const store = await readAuthStore();
  const tokenHash = await sha256(rawToken);
  const session = store.sessions.find(
    (candidate) =>
      candidate.id === sessionId &&
      candidate.tokenHash === tokenHash &&
      !candidate.revokedAt &&
      new Date(candidate.expiresAt).getTime() > Date.now(),
  );

  if (!session) {
    return null;
  }

  const user = store.users.find((candidate) => candidate.id === session.userId);
  return user ? toHubUser(user) : null;
};

export const revokeSession = async (sessionId: string) => {
  const store = await readAuthStore();
  const session = store.sessions.find((candidate) => candidate.id === sessionId);

  if (session && !session.revokedAt) {
    session.revokedAt = nowIso();
    store.securityEvents.push(createSecurityEvent("logout", session.userId));
    await writeAuthStore(store);
  }
};

export const getSecuritySummary = async (userId: string) => {
  const store = await readAuthStore();
  return {
    activeSessions: store.sessions.filter(
      (session) => session.userId === userId && !session.revokedAt && new Date(session.expiresAt).getTime() > Date.now(),
    ),
    events: store.securityEvents.filter((event) => event.userId === userId).slice(-10).reverse(),
  };
};
