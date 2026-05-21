import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth-session";

export async function requireAdminApi() {
  const session = await getCurrentSession();

  if (!session) {
    return {
      user: null,
      response: NextResponse.json(
        { success: false, message: "Non autorise." },
        { status: 401 },
      ),
    };
  }

  if (session.user.roleCode !== "admin") {
    return {
      user: null,
      response: NextResponse.json(
        { success: false, message: "Acces refuse." },
        { status: 403 },
      ),
    };
  }

  return { user: session.user, response: null };
}

export function jsonError(message = "Erreur serveur.", status = 500, error?: unknown) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(error instanceof Error ? { error: error.message } : {}),
    },
    { status },
  );
}

export function toJsonSafe<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, item) => {
      if (typeof item === "bigint") return item.toString();
      if (item && typeof item === "object" && typeof item.toString === "function" && item.constructor?.name === "Decimal") {
        return item.toString();
      }
      return item;
    }),
  );
}
