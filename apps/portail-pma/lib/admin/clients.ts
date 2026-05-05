import { prisma } from "@/lib/prisma";
import { parsePage, parsePageSize } from "@/lib/utils";
import type {
  ClientFilters,
  CreateClientInput,
  UpdateClientInput,
} from "@/types/clients";

function buildClientsWhere(distributorId: string, filters: ClientFilters = {}) {
  const where: Record<string, unknown> = {
    distributor_id: distributorId,
  };

  if (filters.assigned_user_id) {
    where.assigned_user_id = filters.assigned_user_id;
  }

  if (filters.store_id) {
    where.store_id = filters.store_id;
  }

  if (filters.is_active !== undefined && filters.is_active !== "all") {
    where.is_active = filters.is_active;
  }

  if (filters.search?.trim()) {
    const search = filters.search.trim();

    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { billing_name: { contains: search, mode: "insensitive" } },
      { representative_name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { code: { contains: search, mode: "insensitive" } },
      { city: { contains: search, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function getClients(
  distributorId: string,
  filters: ClientFilters = {},
) {
  const page = parsePage(filters.page, 1);
  const pageSize = parsePageSize(filters.page_size, 20, 100);
  const where = buildClientsWhere(distributorId, filters);

  const [items, total] = await prisma.$transaction([
    prisma.clients.findMany({
      where,
      include: {
        users: true,
        stores: true,
      },
      orderBy: [{ name: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.clients.count({ where }),
  ]);

  return {
    items: items.map((client) => ({
      ...client,
      assigned_user_name: client.users
        ? `${client.users.first_name} ${client.users.last_name}`.trim()
        : null,
      store_name: client.stores?.name ?? null,
    })),
    total,
    page,
    pageSize,
  };
}

export async function getClientById(id: string, distributorId: string) {
  const client = await prisma.clients.findFirst({
    where: {
      id,
      distributor_id: distributorId,
    },
    include: {
      users: {
        include: {
          roles: true,
        },
      },
      stores: true,
      bons: {
        orderBy: { created_at: "desc" },
        take: 10,
      },
    },
  });

  if (!client) {
    return null;
  }

  return {
    ...client,
    assigned_user_name: client.users
      ? `${client.users.first_name} ${client.users.last_name}`.trim()
      : null,
    store_name: client.stores?.name ?? null,
  };
}

export async function createClient(input: CreateClientInput) {
  return prisma.clients.create({
    data: {
      distributor_id: input.distributor_id,
      assigned_user_id: input.assigned_user_id ?? null,
      store_id: input.store_id ?? null,
      code: input.code?.trim() || null,
      name: input.name.trim(),
      email: input.email?.trim().toLowerCase() || null,
      phone: input.phone?.trim() || null,
      address_line_1: input.address_line_1?.trim() || null,
      postal_code: input.postal_code?.trim() || null,
      city: input.city?.trim() || null,
      billing_name: input.billing_name?.trim() || null,
      representative_name: input.representative_name?.trim() || null,
      is_active: input.is_active ?? true,
    },
  });
}

export async function updateClient(
  id: string,
  distributorId: string,
  input: UpdateClientInput,
) {
  const current = await prisma.clients.findFirst({
    where: {
      id,
      distributor_id: distributorId,
    },
    select: { id: true },
  });

  if (!current) {
    return null;
  }

  return prisma.clients.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.assigned_user_id !== undefined
        ? { assigned_user_id: input.assigned_user_id ?? null }
        : {}),
      ...(input.store_id !== undefined ? { store_id: input.store_id ?? null } : {}),
      ...(input.code !== undefined ? { code: input.code?.trim() || null } : {}),
      ...(input.email !== undefined
        ? { email: input.email?.trim().toLowerCase() || null }
        : {}),
      ...(input.phone !== undefined
        ? { phone: input.phone?.trim() || null }
        : {}),
      ...(input.address_line_1 !== undefined
        ? { address_line_1: input.address_line_1?.trim() || null }
        : {}),
      ...(input.postal_code !== undefined
        ? { postal_code: input.postal_code?.trim() || null }
        : {}),
      ...(input.city !== undefined ? { city: input.city?.trim() || null } : {}),
      ...(input.billing_name !== undefined
        ? { billing_name: input.billing_name?.trim() || null }
        : {}),
      ...(input.representative_name !== undefined
        ? { representative_name: input.representative_name?.trim() || null }
        : {}),
      ...(input.is_active !== undefined ? { is_active: input.is_active } : {}),
    },
  });
}

export async function deleteClient(id: string, distributorId: string) {
  const current = await prisma.clients.findFirst({
    where: {
      id,
      distributor_id: distributorId,
    },
    select: { id: true },
  });

  if (!current) {
    return null;
  }

  return prisma.clients.delete({
    where: { id },
  });
}

export async function getClientsKpis(distributorId: string) {
  const [total_clients, total_active, total_inactive] = await prisma.$transaction([
    prisma.clients.count({
      where: { distributor_id: distributorId },
    }),
    prisma.clients.count({
      where: { distributor_id: distributorId, is_active: true },
    }),
    prisma.clients.count({
      where: { distributor_id: distributorId, is_active: false },
    }),
  ]);

  return {
    total_clients,
    total_active,
    total_inactive,
  };
}