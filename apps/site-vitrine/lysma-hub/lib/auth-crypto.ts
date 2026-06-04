import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const KEY_LENGTH = 64;

export const createToken = () => randomBytes(32).toString("base64url");

export const sha256 = async (value: string) => {
  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(value).digest("hex");
};

export const hashPassword = async (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const key = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `scrypt:${salt}:${key.toString("hex")}`;
};

export const verifyPassword = async (password: string, storedHash: string) => {
  const [algorithm, salt, hash] = storedHash.split(":");

  if (algorithm !== "scrypt" || !salt || !hash) {
    return false;
  }

  const stored = Buffer.from(hash, "hex");
  const key = (await scryptAsync(password, salt, stored.length)) as Buffer;

  return stored.length === key.length && timingSafeEqual(stored, key);
};

export const getAuthSecret = () => {
  const secret = process.env.LYSMA_AUTH_SECRET ?? process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("LYSMA_AUTH_SECRET must be configured in production.");
  }

  return secret ?? "lysma-hub-local-dev-secret-change-me";
};

export const signSessionCookie = async (sessionId: string, rawToken: string) => {
  const signature = await sha256(`${sessionId}.${rawToken}.${getAuthSecret()}`);
  return `${sessionId}.${rawToken}.${signature}`;
};

export const parseSessionCookie = async (value: string | undefined) => {
  if (!value) return null;

  const [sessionId, rawToken, signature] = value.split(".");

  if (!sessionId || !rawToken || !signature) {
    return null;
  }

  const expected = await sha256(`${sessionId}.${rawToken}.${getAuthSecret()}`);

  if (expected !== signature) {
    return null;
  }

  return { sessionId, rawToken };
};
