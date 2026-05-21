import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCdvScope } from "@/lib/admin/access-scope";
import { getBonById } from "@/lib/admin/bons";

type ScopedUser = {
  id: string;
  distributorId: string;
  distributorSlug: string;
};

export async function getScopedBonOrNotFound(params: {
  user: ScopedUser;
  bonId: string;
  role: "cdv" | "rdm" | "store";
}) {
  const bon = await getBonById({
    distributorId: params.user.distributorId,
    bonId: params.bonId,
  });

  if (!bon) notFound();

  if (params.role === "cdv") {
    const scope = await getCdvScope({
      distributorId: params.user.distributorId,
      userId: params.user.id,
    });

    const canRead =
      scope.actorUserIds.includes(bon.created_by_user_id) ||
      (!!bon.assigned_store_id && scope.storeIds.includes(bon.assigned_store_id));

    if (!canRead) notFound();
    return bon;
  }

  const storeLinks = await prisma.user_store_links.findMany({
    where: {
      user_id: params.user.id,
      stores: { distributor_id: params.user.distributorId },
    },
    select: { store_id: true },
  });
  const allowedStoreIds = new Set(storeLinks.map((item) => item.store_id));

  if (!bon.assigned_store_id || !allowedStoreIds.has(bon.assigned_store_id)) {
    notFound();
  }

  return bon;
}
