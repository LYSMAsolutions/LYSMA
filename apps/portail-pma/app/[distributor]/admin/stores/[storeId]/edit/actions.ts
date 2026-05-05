"use server";

import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import { revalidatePath } from "next/cache";

type ActionState = { success: boolean; error: string | null };

export async function updateStoreAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const distributor  = String(formData.get("distributor")    || "").trim();
    const storeId      = String(formData.get("storeId")        || "").trim();
    const code         = String(formData.get("code")           || "").trim().toUpperCase();
    const name         = String(formData.get("name")           || "").trim();
    const internalCode = String(formData.get("internal_code")  || "").trim() || null;
    const city         = String(formData.get("city")           || "").trim();
    const addressLine1 = String(formData.get("address_line_1") || "").trim();
    const addressLine2 = String(formData.get("address_line_2") || "").trim();
    const postalCode   = String(formData.get("postalCode")     || "").trim();
    const phone        = String(formData.get("phone")          || "").trim();
    const email        = String(formData.get("email")          || "").trim().toLowerCase();
    const isActive     = String(formData.get("isActive")       || "") === "true";
    const storeType    = String(formData.get("store_type")     || "standard").trim();

    const VALID_TYPES = ["standard", "sav"];
    const finalType = VALID_TYPES.includes(storeType) ? storeType : "standard";

    if (!storeId || !code || !name)
      return { success: false, error: "Code et nom obligatoires." };

    const user = await requireAccess({ allowedRoles: ["admin"], distributorSlug: distributor });

    const existing = await prisma.stores.findFirst({
      where: { id: storeId, distributor_id: user.distributorId },
      include: { store_accounts: true },
    });
    if (!existing) return { success: false, error: "Magasin introuvable." };

    // Vérifier unicité internal_code
    if (internalCode) {
      const conflict = await prisma.stores.findFirst({
        where: { distributor_id: user.distributorId, internal_code: internalCode, NOT: { id: storeId } },
      });
      if (conflict) return { success: false, error: "Ce code interne est déjà utilisé par un autre magasin." };
    }

    const finalEmail = email || existing.email;

    await prisma.$transaction(async (tx) => {
      await tx.stores.update({
        where: { id: storeId },
        data: {
          code, name,
          internal_code:  internalCode,
          city:           city         || null,
          address_line_1: addressLine1 || null,
          address_line_2: addressLine2 || null,
          postal_code:    postalCode   || null,
          phone:          phone        || null,
          email:          finalEmail   || null,
          is_active:      isActive,
          store_type:     finalType,
        },
      });

      if (finalEmail && existing.store_accounts) {
        await tx.store_accounts.update({
          where: { store_id: storeId },
          data: { login_email: finalEmail },
        });
      }
    });

    revalidatePath(`/${user.distributorSlug}/admin/stores`);
    revalidatePath(`/${user.distributorSlug}/admin/stores/${storeId}`);

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Erreur serveur." };
  }
}