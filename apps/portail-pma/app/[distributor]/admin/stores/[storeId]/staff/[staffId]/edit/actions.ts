"use server";

import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

type UpdateStoreStaffState = {
  success: boolean;
  error: string | null;
};

export async function updateStoreStaffAction(
  distributor: string,
  storeId: string,
  staffId: string,
  formData: FormData
): Promise<UpdateStoreStaffState> {
  const user = await requireAccess({
    allowedRoles: ["admin"],
    distributorSlug: distributor,
  });

  const firstName = String(formData.get("first_name") ?? formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? formData.get("lastName") ?? "").trim();
  const initials = String(formData.get("initials") ?? "").trim().toUpperCase();
  const pin = String(formData.get("pin") ?? "").trim();
  const status = String(formData.get("status") ?? "active").trim();

  if (!firstName || !lastName) {
    return { success: false, error: "Le prénom et le nom sont obligatoires." };
  }

  if (!initials) {
    return { success: false, error: "Les initiales sont obligatoires." };
  }

  const staff = await prisma.store_staff.findFirst({
    where: {
      id: staffId,
      store_id: storeId,
      stores: {
        distributor_id: user.distributorId,
      },
    },
    select: {
      id: true,
    },
  });

  if (!staff) {
    return { success: false, error: "Magasinier introuvable." };
  }

  const duplicateInitials = await prisma.store_staff.findFirst({
    where: {
      store_id: storeId,
      initials,
      NOT: {
        id: staffId,
      },
    },
    select: { id: true },
  });

  if (duplicateInitials) {
    return {
      success: false,
      error: "Ces initiales sont déjà utilisées dans ce magasin.",
    };
  }

  await prisma.store_staff.update({
    where: {
      id: staffId,
    },
    data: {
      first_name: firstName,
      last_name: lastName,
      initials,
      is_active: status === "active",
      ...(pin
        ? {
            pin_hash: await bcrypt.hash(pin, 10),
            must_change_pin: true,
            pin_updated_at: new Date(),
          }
        : {}),
    },
  });

  revalidatePath(`/${distributor}/admin/stores/${storeId}`);
  revalidatePath(`/${distributor}/admin/stores/${storeId}/staff`);
  revalidatePath(`/${distributor}/admin/stores/${storeId}/staff/${staffId}/edit`);

  return {
    success: true,
    error: null,
  };
}
