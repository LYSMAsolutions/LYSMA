import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAuthorized(req: NextRequest) {
  const apiKey = req.headers.get("x-internal-api-key");
  return Boolean(process.env.INTERNAL_API_KEY) && apiKey === process.env.INTERNAL_API_KEY;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, message: "Non autorise." }, { status: 401 });
  }

  const [users, stores, staff] = await Promise.all([
    prisma.users.findMany({
      where: { deleted_at: { not: null } },
      orderBy: { deleted_at: "desc" },
      take: 100,
      include: { distributors: true, roles: true },
    }),
    prisma.stores.findMany({
      where: { deleted_at: { not: null } },
      orderBy: { deleted_at: "desc" },
      take: 100,
      include: { distributors: true },
    }),
    prisma.store_staff.findMany({
      where: { deleted_at: { not: null } },
      orderBy: { deleted_at: "desc" },
      take: 100,
      include: { stores: { include: { distributors: true } } },
    }),
  ]);

  return NextResponse.json({
    success: true,
    items: [
      ...users.map((user) => ({
        id: user.id,
        type: "user",
        outil: "portail-pma",
        label: `${user.first_name} ${user.last_name}`,
        clientNom: user.distributors.name,
        detail: user.roles.code,
        deletedAt: user.deleted_at?.toISOString() ?? null,
        deletedBy: user.deleted_by,
      })),
      ...stores.map((store) => ({
        id: store.id,
        type: "store",
        outil: "portail-pma",
        label: `${store.code} - ${store.name}`,
        clientNom: store.distributors.name,
        detail: store.store_type,
        deletedAt: store.deleted_at?.toISOString() ?? null,
        deletedBy: store.deleted_by,
      })),
      ...staff.map((member) => ({
        id: member.id,
        type: "store_staff",
        outil: "portail-pma",
        label: `${member.first_name} ${member.last_name}`,
        clientNom: member.stores.distributors.name,
        detail: `${member.stores.code} - ${member.stores.name}`,
        deletedAt: member.deleted_at?.toISOString() ?? null,
        deletedBy: member.deleted_by,
      })),
    ].sort((a, b) => new Date(b.deletedAt ?? 0).getTime() - new Date(a.deletedAt ?? 0).getTime()),
  });
}
