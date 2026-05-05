"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

type ActionState = {
  success: boolean;
  error: string | null;
};

export async function createStoreStaffAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const storeId = String(formData.get("storeId") || "").trim();
    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const initials = String(formData.get("initials") || "")
      .trim()
      .toUpperCase();
    const pin = String(formData.get("pin") || "");
    const isActive = String(formData.get("isActive") || "") === "true";

    if (!storeId || !firstName || !lastName || !initials || !pin) {
      return {
        success: false,
        error: "Tous les champs sont obligatoires.",
      };
    }

    const existing = await prisma.store_staff.findFirst({
      where: {
        store_id: storeId,
        initials,
      },
    });

    if (existing) {
      return {
        success: false,
        error: "Ces initiales sont déjà utilisées dans ce magasin.",
      };
    }

    await prisma.store_staff.create({
      data: {
        store_id: storeId,
        first_name: firstName,
        last_name: lastName,
        initials,
        pin_hash: await bcrypt.hash(pin, 10),
        is_active: isActive,
        must_change_pin: true,
      },
    });

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur serveur.",
    };
  }
}