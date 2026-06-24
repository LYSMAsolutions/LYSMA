import { NextResponse } from "next/server";
import { listMemoryEntries } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;

  try {
    const entries = await listMemoryEntries(status ? { status } : undefined);
    return NextResponse.json({ entries });
  } catch (err) {
    console.error("[ECHO][api/memoire] GET error", err);
    return NextResponse.json({ error: "Erreur base de données." }, { status: 500 });
  }
}
