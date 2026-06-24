import { NextResponse } from "next/server";
import { updateMemoryEntryStatus, deleteMemoryEntry } from "@/lib/db";
import type { MemoryStatus } from "@/lib/db";

export const runtime = "nodejs";

const ALLOWED_TRANSITIONS: Record<string, { status: MemoryStatus; validated: boolean }> = {
  valider: { status: "valide", validated: true },
  rejeter: { status: "rejete", validated: false },
  obsolete: { status: "obsolete", validated: false },
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({})) as { action?: string };
  const action = body.action;

  if (!action || !ALLOWED_TRANSITIONS[action]) {
    return NextResponse.json(
      { error: "Action invalide. Valeurs acceptées : valider, rejeter, obsolete." },
      { status: 400 }
    );
  }

  try {
    const { status, validated } = ALLOWED_TRANSITIONS[action];
    const updated = await updateMemoryEntryStatus(id, status, validated);
    return NextResponse.json({ success: true, entry: updated });
  } catch (err) {
    console.error("[ECHO][api/memoire/id] PATCH error", err);
    return NextResponse.json({ error: "Mise à jour échouée." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await deleteMemoryEntry(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ECHO][api/memoire/id] DELETE error", err);
    return NextResponse.json({ error: "Suppression échouée." }, { status: 500 });
  }
}
