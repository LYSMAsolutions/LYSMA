"use server";

import { revalidatePath } from "next/cache";
import { requireAccess } from "@/lib/require-access";
import { prisma } from "@/lib/prisma";
import { buildCdvClientWhere, getCdvScope } from "@/lib/admin/access-scope";

export async function updateCdvClientAtc(
  distributor: string,
  clientId: string,
  formData: FormData,
) {
  const user = await requireAccess({ allowedRoles: ["cdv"], distributorSlug: distributor });
  const atcId = String(formData.get("atcId") || "");
  const scope = await getCdvScope({ distributorId: user.distributorId, userId: user.id });

  const client = await prisma.clients.findFirst({
    where: {
      id: clientId,
      ...buildCdvClientWhere({
        distributorId: user.distributorId,
        actorUserIds: scope.actorUserIds,
        storeIds: scope.storeIds,
      }),
    },
    select: { id: true },
  });

  if (!client) return;

  const targetAtc = await prisma.users.findFirst({
    where: {
      id: atcId,
      distributor_id: user.distributorId,
      supervisor_id: user.id,
      roles: { code: "atc" },
      is_active: true,
    },
    select: { id: true },
  });

  if (!targetAtc) return;

  await prisma.clients.update({
    where: { id: clientId },
    data: { assigned_user_id: targetAtc.id },
  });

  revalidatePath(`/${user.distributorSlug}/cdv/clients`);
  revalidatePath(`/${user.distributorSlug}/cdv/clients/${clientId}`);
}
