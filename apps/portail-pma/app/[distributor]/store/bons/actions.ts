"use server";

import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import { revalidatePath } from "next/cache";
import { validateBonStatusActionInput } from "@/lib/validations/bons";

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

function getNextStatus(currentStatus: string, action: BonAction): BonStatus | null {
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
        currentStatus === "attente_fournisseur" ||
        currentStatus === "a_corriger"
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

export async function updateStoreBonStatusAction(
  distributor: string,
  formData: FormData
) {
  const currentUser = await requireAccess({
    allowedRoles: ["store", "store_staff"],
    distributorSlug: distributor,
  });

  const payload = validateBonStatusActionInput({
    bonId: formData.get("bonId"),
    action: formData.get("action"),
    reason: formData.get("reason"),
  });

  const bon = await prisma.bons.findFirst({
    where: {
      id: payload.bonId,
      distributor_id: currentUser.distributorId,
    },
    include: {
      stores: true,
    },
  });

  if (!bon) {
    throw new Error("Bon introuvable ou inaccessible.");
  }

  const storeLinks = await prisma.user_store_links.findMany({
    where: {
      user_id: currentUser.id,
    },
    select: {
      store_id: true,
    },
  });

  const allowedStoreIds = new Set(storeLinks.map((item) => item.store_id));

  if (!bon.assigned_store_id || !allowedStoreIds.has(bon.assigned_store_id)) {
    throw new Error("Ce bon n’est pas rattaché à un magasin que tu peux gérer.");
  }

  const nextStatus = getNextStatus(bon.status, payload.action as BonAction);

  if (!nextStatus) {
    throw new Error("Transition de statut non autorisée.");
  }

  const now = new Date();

  const updateData: Record<string, unknown> = {
    status: nextStatus,
    updated_at: now,
  };

  if (payload.action === "prendre-en-charge") {
    updateData.taken_at = now;
    updateData.taken_by_staff_id = null;
  }

  if (payload.action === "demarrer" || payload.action === "reprendre") {
    updateData.started_at = now;
  }

  if (payload.action === "corriger") {
    updateData.corrected_at = now;
    updateData.correction_reason = payload.reason || null;
  }

  if (
    payload.action === "attente-client" ||
    payload.action === "attente-fournisseur"
  ) {
    updateData.comment = payload.reason || null;
  }

  if (payload.action === "traiter") {
    updateData.completed_at = now;
  }

  if (payload.action === "refuser") {
    updateData.refused_at = now;
    updateData.refusal_reason = payload.reason || null;
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
        action_key: payload.action,
        changed_by_user_id: currentUser.id,
        reason: payload.reason || null,
        created_at: now,
      },
    });
  });

  const storeBase = `/${currentUser.distributorSlug}/store`;

  revalidatePath(`${storeBase}/bons`);
  revalidatePath(`${storeBase}/bons/${bon.id}`);
  revalidatePath(`/${currentUser.distributorSlug}/admin/bons`);
  revalidatePath(`/${currentUser.distributorSlug}/admin/bons/${bon.id}`);
  revalidatePath(`/${currentUser.distributorSlug}/admin/bons/${bon.id}/historique`);
  revalidatePath(`/${currentUser.distributorSlug}/atc/bons`);
  revalidatePath(`/${currentUser.distributorSlug}/atc/bons/${bon.id}`);
}