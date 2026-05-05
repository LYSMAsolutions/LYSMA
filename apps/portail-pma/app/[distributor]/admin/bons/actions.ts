"use server";

import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

type BonStatus =
  | "envoye"
  | "non_pris_en_charge"
  | "pris_en_charge"
  | "en_cours"
  | "attente_client"
  | "attente_fournisseur"
  | "a_corriger"
  | "traite"
  | "refuse";

type BonAction =
  | "prendre-en-charge"
  | "demarrer"
  | "attente-client"
  | "attente-fournisseur"
  | "corriger"
  | "reprendre"
  | "traiter"
  | "refuser";

function getNextStatus(
  currentStatus: string,
  action: BonAction
): BonStatus | null {
  switch (action) {
    case "prendre-en-charge":
      if (currentStatus === "envoye" || currentStatus === "non_pris_en_charge") {
        return "pris_en_charge";
      }
      return null;

    case "demarrer":
      if (currentStatus === "pris_en_charge") {
        return "en_cours";
      }
      return null;

    case "attente-client":
      if (currentStatus === "pris_en_charge" || currentStatus === "en_cours") {
        return "attente_client";
      }
      return null;

    case "attente-fournisseur":
      if (currentStatus === "pris_en_charge" || currentStatus === "en_cours") {
        return "attente_fournisseur";
      }
      return null;

    case "corriger":
      if (
        currentStatus === "envoye" ||
        currentStatus === "non_pris_en_charge" ||
        currentStatus === "pris_en_charge" ||
        currentStatus === "en_cours"
      ) {
        return "a_corriger";
      }
      return null;

    case "reprendre":
      if (
        currentStatus === "attente_client" ||
        currentStatus === "attente_fournisseur" ||
        currentStatus === "a_corriger"
      ) {
        return "en_cours";
      }
      return null;

    case "traiter":
      if (
        currentStatus === "en_cours" ||
        currentStatus === "attente_client" ||
        currentStatus === "attente_fournisseur"
      ) {
        return "traite";
      }
      return null;

    case "refuser":
      if (
        currentStatus === "envoye" ||
        currentStatus === "non_pris_en_charge" ||
        currentStatus === "pris_en_charge" ||
        currentStatus === "en_cours" ||
        currentStatus === "attente_client" ||
        currentStatus === "attente_fournisseur" ||
        currentStatus === "a_corriger"
      ) {
        return "refuse";
      }
      return null;

    default:
      return null;
  }
}

export async function updateBonStatusAction(
  distributor: string,
  formData: FormData
) {
  const user = await requireAccess({
    allowedRoles: ["admin"],
    distributorSlug: distributor,
  })

  const bonId = String(formData.get("bonId") || "").trim();
  const action = String(formData.get("action") || "").trim() as BonAction;
  const reason = String(formData.get("reason") || "").trim();

  if (!bonId) {
    throw new Error("Bon introuvable.");
  }

  const bon = await prisma.bons.findFirst({
    where: {
      id: bonId,
      distributor_id: user.distributorId,
    },
    select: {
      id: true,
      bon_number: true,
      status: true,
    },
  });

  if (!bon) {
    throw new Error("Bon introuvable ou inaccessible.");
  }

  const nextStatus = getNextStatus(bon.status, action);

  if (!nextStatus) {
    throw new Error("Transition de statut non autorisée.");
  }

  const now = new Date();

  const updateData: Record<string, unknown> = {
    status: nextStatus,
    updated_at: now,
  };

  if (action === "prendre-en-charge") {
    updateData.taken_at = now;
  }

  if (action === "demarrer" || action === "reprendre") {
    updateData.started_at = now;
  }

  if (action === "corriger") {
    updateData.corrected_at = now;
    updateData.correction_reason = reason || null;
  }

  if (action === "attente-client" || action === "attente-fournisseur") {
    updateData.comment = reason || null;
  }

  if (action === "traiter") {
    updateData.completed_at = now;
  }

  if (action === "refuser") {
    updateData.refused_at = now;
    updateData.refusal_reason = reason || null;
  }

  await prisma.$transaction(async (tx) => {
    await tx.bons.update({
      where: {
        id: bon.id,
      },
      data: updateData,
    });

    await tx.bon_status_history.create({
      data: {
        bon_id: bon.id,
        old_status: bon.status,
        new_status: nextStatus,
        action_key: action,
        changed_by_user_id: user.id,
        reason: reason || null,
        created_at: now,
      },
    });
  });

  const adminBase = `/${user.distributorSlug}/admin`;

  revalidatePath(`${adminBase}/bons`);
  revalidatePath(`${adminBase}/bons/${bon.id}`);
  revalidatePath(`${adminBase}/bons/${bon.id}/detail`);
  revalidatePath(`${adminBase}/bons/${bon.id}/historique`);
  revalidatePath(`${adminBase}/bons/${bon.id}/lignes`);
}