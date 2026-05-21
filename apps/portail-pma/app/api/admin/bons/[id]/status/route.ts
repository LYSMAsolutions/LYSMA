import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, requireAdminApi } from "@/lib/api-admin";

const TRANSITIONS: Record<string, Record<string, string>> = {
  envoye: { "prendre-en-charge": "pris_en_charge", corriger: "a_corriger", refuser: "refuse" },
  non_pris_en_charge: { "prendre-en-charge": "pris_en_charge", corriger: "a_corriger", refuser: "refuse" },
  pris_en_charge: { demarrer: "en_cours", "attente-client": "attente_client", "attente-fournisseur": "attente_fournisseur", corriger: "a_corriger", refuser: "refuse" },
  en_cours: { "attente-client": "attente_client", "attente-fournisseur": "attente_fournisseur", corriger: "a_corriger", traiter: "traite", refuser: "refuse" },
  attente_client: { reprendre: "en_cours", traiter: "traite", refuser: "refuse" },
  attente_fournisseur: { reprendre: "en_cours", traiter: "traite", refuser: "refuse" },
  a_corriger: { reprendre: "en_cours", refuser: "refuse" },
};

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { user, response } = await requireAdminApi();
    if (response) return response;

    const { id } = await context.params;
    const body = await req.json();
    const action = String(body.action || "").trim();
    const requestedStatus = String(body.status || "").trim();
    const reason = String(body.reason || "").trim();

    const bon = await prisma.bons.findFirst({
      where: { id, distributor_id: user.distributorId },
      select: { id: true, status: true },
    });
    if (!bon) return jsonError("Bon introuvable.", 404);

    const nextStatus = requestedStatus || TRANSITIONS[bon.status]?.[action];
    if (!nextStatus) return jsonError("Transition de statut non autorisee.", 400);

    const now = new Date();
    const data: Record<string, unknown> = { status: nextStatus, updated_at: now };

    if (nextStatus === "pris_en_charge") data.taken_at = now;
    if (nextStatus === "en_cours") data.started_at = now;
    if (nextStatus === "a_corriger") {
      data.corrected_at = now;
      data.correction_reason = reason || null;
    }
    if (nextStatus === "traite") data.completed_at = now;
    if (nextStatus === "refuse") {
      data.refused_at = now;
      data.refusal_reason = reason || null;
    }
    if (nextStatus.startsWith("attente_")) data.comment = reason || null;

    await prisma.$transaction(async (tx) => {
      await tx.bons.update({ where: { id }, data });
      await tx.bon_status_history.create({
        data: {
          bon_id: id,
          old_status: bon.status,
          new_status: nextStatus,
          action_key: action || "admin_status_update",
          changed_by_user_id: user.id,
          reason: reason || null,
        },
      });
    });

    return NextResponse.json({ success: true, status: nextStatus });
  } catch (error) {
    return jsonError("Erreur serveur.", 500, error);
  }
}
