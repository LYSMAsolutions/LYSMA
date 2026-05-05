import { prisma } from "@/lib/prisma";
import { parsePage, parsePageSize } from "@/lib/utils";
import type {
  CreateUserInput,
  UpdateUserInput,
  UserFilters,
} from "@/types/users";

function buildUsersWhere(filters: UserFilters = {}) {
  const where: Record<string, unknown> = {
    distributor_id: filters.distributor_id,
  };

  if (filters.role_code && filters.role_code !== "all") {
    where.roles = {
      code: filters.role_code,
    };
  }

  if (filters.is_active !== undefined && filters.is_active !== "all") {
    where.is_active = filters.is_active;
  }

  if (filters.search?.trim()) {
    const search = filters.search.trim();

    where.OR = [
      { first_name: { contains: search, mode: "insensitive" } },
      { last_name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { code: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  return where;
}

export async function getUsers(filters: UserFilters) {
  const page = parsePage(filters.page, 1);
  const pageSize = parsePageSize(filters.page_size, 20, 100);
  const where = buildUsersWhere(filters);

  const [items, total] = await prisma.$transaction([
    prisma.users.findMany({
    where,
      include: {
        roles: true,
      },
      orderBy: [{ last_name: "asc" }, { first_name: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.users.count({ where }),
  ]);

  return {
    items: items.map((user) => ({
      ...user,
      role_code: user.roles.code,
      role_label: user.roles.label,
      full_name: `${user.first_name} ${user.last_name}`.trim(),
    })),
    total,
    page,
    pageSize,
  };
}

export async function getUserById(id: string, distributorId: string) {
  const user = await prisma.users.findFirst({
    where: {
      id,
      distributor_id: distributorId,
    },
    include: {
      roles: true,
      user_store_links: {
        include: {
          stores: true,
        },
        orderBy: {
          stores: {
            name: "asc",
          },
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return {
    ...user,
    role_code: user.roles.code,
    role_label: user.roles.label,
    full_name: `${user.first_name} ${user.last_name}`.trim(),
  };
}

export async function getUserByEmail(email: string, distributorId: string) {
  return prisma.users.findFirst({
    where: {
      distributor_id: distributorId,
      email: email.trim().toLowerCase(),
    },
    include: {
      roles: true,
    },
  });
}

export async function createUser(input: CreateUserInput) {
  return prisma.users.create({
    data: {
      distributor_id: input.distributor_id,
      role_id: input.role_id,
      first_name: input.first_name.trim(),
      last_name: input.last_name.trim(),
      email: input.email.trim().toLowerCase(),
      password_hash: input.password_hash,
      is_active: input.is_active ?? true,
      code: input.code?.trim() || null,
      phone: input.phone?.trim() || null,
      must_change_password: input.must_change_password ?? true,
    },
    include: {
      roles: true,
    },
  });
}

export async function updateUser(
  id: string,
  distributorId: string,
  input: UpdateUserInput,
) {
  const current = await prisma.users.findFirst({
    where: {
      id,
      distributor_id: distributorId,
    },
    select: { id: true },
  });

  if (!current) {
    return null;
  }

  return prisma.users.update({
    where: { id },
    data: {
      ...(input.first_name !== undefined
        ? { first_name: input.first_name.trim() }
        : {}),
      ...(input.last_name !== undefined
        ? { last_name: input.last_name.trim() }
        : {}),
      ...(input.email !== undefined
        ? { email: input.email.trim().toLowerCase() }
        : {}),
      ...(input.is_active !== undefined ? { is_active: input.is_active } : {}),
      ...(input.code !== undefined ? { code: input.code?.trim() || null } : {}),
      ...(input.phone !== undefined
        ? { phone: input.phone?.trim() || null }
        : {}),
      ...(input.role_id !== undefined ? { role_id: input.role_id } : {}),
      ...(input.password_hash !== undefined
        ? { password_hash: input.password_hash }
        : {}),
      ...(input.must_change_password !== undefined
        ? { must_change_password: input.must_change_password }
        : {}),
    },
    include: {
      roles: true,
    },
  });
}

export async function deleteUser(id: string, distributorId: string) {
  const current = await prisma.users.findFirst({
    where: {
      id,
      distributor_id: distributorId,
    },
    select: { id: true },
  });

  if (!current) {
    return null;
  }

  return prisma.users.delete({
    where: { id },
  });
}

export async function setUserActiveState(
  id: string,
  distributorId: string,
  isActive: boolean,
) {
  return updateUser(id, distributorId, { is_active: isActive });
}

export async function getRoleOptions() {
  return prisma.roles.findMany({
    take: 100,
    orderBy: { label: "asc" },
  });
}

export async function getUsersKpis(distributorId: string) {
  const users = await prisma.users.findMany({
    where: {
      distributor_id: distributorId,
    },
    include: {
      roles: true,
    },
  });

  const byRoleCode = (code: string) =>
    users.filter((user) => user.roles.code === code).length;

  return {
    total_users: users.length,
    total_admin: byRoleCode("admin"),
    total_cdv: byRoleCode("cdv"),
    total_atc: byRoleCode("atc"),
    total_rdm: byRoleCode("rdm"),
    total_active: users.filter((user) => user.is_active).length,
    total_inactive: users.filter((user) => !user.is_active).length,
  };
}