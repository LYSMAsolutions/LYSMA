"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

type ActionState = {
  success: boolean;
  error: string | null;
};

export async function updateStoreAccountAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const storeId = String(formData.get("storeId") || "").trim();
    const loginEmail = String(formData.get("loginEmail") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");
    const isActive = String(formData.get("isActive") || "") === "true";
    const mustChangePassword =
      String(formData.get("mustChangePassword") || "") === "true";

    if (!storeId || !loginEmail) {
      return {
        success: false,
        error: "Le magasin et le login email sont obligatoires.",
      };
    }

    const existing = await prisma.store_accounts.findUnique({
      where: {
        store_id: storeId,
      },
    });

    if (!existing) {
      await prisma.store_accounts.create({
        data: {
          store_id: storeId,
          login_email: loginEmail,
          password_hash: password ? await bcrypt.hash(password, 10) : "",
          is_active: isActive,
          must_change_password: mustChangePassword,
        },
      });
    } else {
      await prisma.store_accounts.update({
        where: {
          store_id: storeId,
        },
        data: {
          login_email: loginEmail,
          ...(password ? { password_hash: await bcrypt.hash(password, 10) } : {}),
          is_active: isActive,
          must_change_password: mustChangePassword,
        },
      });
    }

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