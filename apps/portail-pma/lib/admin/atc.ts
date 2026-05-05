import { prisma } from "@/lib/prisma";
import { parsePage, parsePageSize } from "@/lib/utils";

export async function getAtcUsers(distributorId: string, search?: string) {
  return prisma.users.findMany({
    where: {
      distributor_id: distributorId,
      roles: {
        code: "atc",
      },
      ...(search?.trim()
        ? {
            OR: [
              { first_name: { contains: search.trim(), mode: "insensitive" } },
              { last_name: { contains: search.trim(), mode: "insensitive" } },
              { email: { contains: search.trim(), mode: "insensitive" } },
              { code: { contains: search.trim(), mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      roles: true,
      _count: {
        select: {
          clients: true,
          bons: true,
        },
      },
    },
    orderBy: [{ last_name: "asc" }, { first_name: "asc" }],
  });
}

export async function getAtcById(id: string, distributorId: string) {
  const user = await prisma.users.findFirst({
    where: {
      id,
      distributor_id: distributorId,
      roles: {
        code: "atc",
      },
    },
    include: {
      roles: true,
      clients: {
        orderBy: { name: "asc" },
      },
      bons: {
        orderBy: { created_at: "desc" },
        take: 20,
      },
      _count: {
        select: {
          clients: true,
          bons: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return {
    ...user,
    full_name: `${user.first_name} ${user.last_name}`.trim(),
  };
}

export async function getAtcClients(
  distributorId: string,
  atcUserId: string,
  pageValue?: number,
  pageSizeValue?: number,
) {
  const page = parsePage(pageValue, 1);
  const pageSize = parsePageSize(pageSizeValue, 20, 100);

  const where = {
    distributor_id: distributorId,
    assigned_user_id: atcUserId,
  };

  const [items, total] = await prisma.$transaction([
    prisma.clients.findMany({
      where,
      include: {
        stores: true,
      },
      orderBy: { name: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.clients.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
  };
}

export async function getAtcDashboardStats(distributorId: string, atcUserId: string) {
  const [
    total_clients,
    total_bons,
    bons_envoyes,
    bons_en_cours,
    bons_traites,
    bons_en_retard,
  ] = await prisma.$transaction([
    prisma.clients.count({
      where: {
        distributor_id: distributorId,
        assigned_user_id: atcUserId,
      },
    }),
    prisma.bons.count({
      where: {
        distributor_id: distributorId,
        created_by_user_id: atcUserId,
      },
    }),
    prisma.bons.count({
      where: {
        distributor_id: distributorId,
        created_by_user_id: atcUserId,
        status: "envoye",
      },
    }),
    prisma.bons.count({
      where: {
        distributor_id: distributorId,
        created_by_user_id: atcUserId,
        status: "en_cours",
      },
    }),
    prisma.bons.count({
      where: {
        distributor_id: distributorId,
        created_by_user_id: atcUserId,
        status: "traite",
      },
    }),
    prisma.bons.count({
      where: {
        distributor_id: distributorId,
        created_by_user_id: atcUserId,
        due_at: {
          lt: new Date(),
        },
        NOT: {
          status: {
            in: ["traite", "refuse"],
          },
        },
      },
    }),
  ]);

  return {
    total_clients,
    total_bons,
    bons_envoyes,
    bons_en_cours,
    bons_traites,
    bons_en_retard,
  };
}