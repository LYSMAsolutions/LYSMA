import { prisma } from "@/lib/prisma";

export async function getCdvUsers(distributorId: string, search?: string) {
  return prisma.users.findMany({
    where: {
      distributor_id: distributorId,
      roles: {
        code: "cdv",
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
    },
    orderBy: [{ last_name: "asc" }, { first_name: "asc" }],
  });
}

export async function getCdvById(id: string, distributorId: string) {
  const user = await prisma.users.findFirst({
    where: {
      id,
      distributor_id: distributorId,
      roles: {
        code: "cdv",
      },
    },
    include: {
      roles: true,
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

export async function getCdvAtcList(distributorId: string) {
  const atcUsers = await prisma.users.findMany({
    where: {
      distributor_id: distributorId,
      roles: {
        code: "atc",
      },
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

  return atcUsers.map((user) => ({
    ...user,
    full_name: `${user.first_name} ${user.last_name}`.trim(),
    clients_count: user._count.clients,
    bons_count: user._count.bons,
  }));
}

export async function getCdvEquipe(distributorId: string) {
  const members = await prisma.users.findMany({
    where: {
      distributor_id: distributorId,
      roles: {
        code: {
          in: ["cdv", "atc", "rdm"],
        },
      },
    },
    include: {
      roles: true,
      _count: {
        select: {
          clients: true,
        },
      },
    },
    orderBy: [{ roles: { label: "asc" } }, { last_name: "asc" }, { first_name: "asc" }],
  });

  return members.map((member) => ({
    ...member,
    full_name: `${member.first_name} ${member.last_name}`.trim(),
    role_code: member.roles.code,
    role_label: member.roles.label,
    clients_count: member._count.clients,
  }));
}

export async function getCdvDashboardStats(distributorId: string) {
  const [
    total_atc,
    total_clients,
    total_bons,
    bons_a_traiter,
    bons_en_retard,
  ] = await prisma.$transaction([
    prisma.users.count({
      where: {
        distributor_id: distributorId,
        roles: {
          code: "atc",
        },
      },
    }),
    prisma.clients.count({
      where: {
        distributor_id: distributorId,
      },
    }),
    prisma.bons.count({
      where: {
        distributor_id: distributorId,
      },
    }),
    prisma.bons.count({
      where: {
        distributor_id: distributorId,
        status: {
          in: ["envoye", "non_pris_en_charge", "a_corriger"],
        },
      },
    }),
    prisma.bons.count({
      where: {
        distributor_id: distributorId,
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
    total_atc,
    total_clients,
    total_bons,
    bons_a_traiter,
    bons_en_retard,
  };
}