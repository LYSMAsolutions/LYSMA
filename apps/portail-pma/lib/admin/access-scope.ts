import { prisma } from "@/lib/prisma";

export async function getUserStoreIds(params: {
  distributorId: string;
  userId: string;
}) {
  const links = await prisma.user_store_links.findMany({
    where: {
      user_id: params.userId,
      stores: {
        distributor_id: params.distributorId,
      },
    },
    select: {
      store_id: true,
    },
  });

  return links.map((link) => link.store_id);
}

export async function getCdvScope(params: {
  distributorId: string;
  userId: string;
}) {
  const [atcs, storeIds] = await Promise.all([
    prisma.users.findMany({
      where: {
        distributor_id: params.distributorId,
        supervisor_id: params.userId,
        roles: { code: "atc" },
      },
      select: { id: true },
    }),
    getUserStoreIds(params),
  ]);

  const atcIds = atcs.map((atc) => atc.id);
  const actorUserIds = Array.from(new Set([params.userId, ...atcIds]));

  return {
    atcIds,
    storeIds,
    actorUserIds,
  };
}

export function buildCdvBonWhere(params: {
  distributorId: string;
  actorUserIds: string[];
  storeIds: string[];
}) {
  return {
    distributor_id: params.distributorId,
    OR: [
      { created_by_user_id: { in: params.actorUserIds } },
      ...(params.storeIds.length
        ? [{ assigned_store_id: { in: params.storeIds } }]
        : []),
    ],
  };
}

export function buildCdvClientWhere(params: {
  distributorId: string;
  actorUserIds: string[];
  storeIds: string[];
}) {
  return {
    distributor_id: params.distributorId,
    OR: [
      { assigned_user_id: { in: params.actorUserIds } },
      ...(params.storeIds.length ? [{ store_id: { in: params.storeIds } }] : []),
    ],
  };
}

export function buildCdvGarantieWhere(params: {
  distributorId: string;
  actorUserIds: string[];
  storeIds: string[];
}) {
  return {
    distributor_id: params.distributorId,
    OR: [
      { assigned_user_id: { in: params.actorUserIds } },
      ...(params.storeIds.length ? [{ magasin_id: { in: params.storeIds } }] : []),
    ],
  };
}
