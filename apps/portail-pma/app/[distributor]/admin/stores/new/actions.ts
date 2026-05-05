"use server";

import { prisma } from "@/lib/prisma";

type ActionState = {
  success: boolean;
  error: string | null;
};

export async function createStoreAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const distributorId = String(formData.get("distributorId") || "").trim();
    const code = String(formData.get("code") || "").trim().toUpperCase();
    const name = String(formData.get("name") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const address = String(formData.get("address") || "").trim();
    const postalCode = String(formData.get("postalCode") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const isActive = String(formData.get("isActive") || "") === "true";

    if (!distributorId || !code || !name) {
      return {
        success: false,
        error: "Code, nom et distributeur sont obligatoires.",
      };
    }

    const existing = await prisma.stores.findFirst({
      where: {
        distributor_id: distributorId,
        code,
      },
    });

    if (existing) {
      return {
        success: false,
        error: "Un magasin avec ce code existe déjà.",
      };
    }

    await prisma.stores.create({
      data: {
        distributor_id: distributorId,
        code,
        name,
        city: city || null,
        address_line_1: address || null,
        postal_code: postalCode || null,
        phone: phone || null,
        email: email || null,
        is_active: isActive,
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
