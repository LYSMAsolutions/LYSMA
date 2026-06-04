import type { UserRole } from "./client-platform-types";

export type AuthUserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  siteSlug: string | null;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthSessionRecord = {
  id: string;
  userId: string;
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
  revokedAt: string | null;
};

export type AuthTokenPurpose = "email_verification" | "password_reset";

export type AuthTokenRecord = {
  id: string;
  userId: string;
  tokenHash: string;
  purpose: AuthTokenPurpose;
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
};

export type SecurityEventRecord = {
  id: string;
  userId: string | null;
  type:
    | "register"
    | "email_verification_sent"
    | "email_verified"
    | "login_success"
    | "login_failed"
    | "logout"
    | "password_reset_requested"
    | "password_reset_completed";
  email?: string;
  createdAt: string;
};

export type AuthStoreData = {
  users: AuthUserRecord[];
  sessions: AuthSessionRecord[];
  tokens: AuthTokenRecord[];
  securityEvents: SecurityEventRecord[];
};

export type AuthResult = {
  ok: boolean;
  message: string;
};

export type AuthTokenResult = AuthResult & {
  devLink?: string;
};
