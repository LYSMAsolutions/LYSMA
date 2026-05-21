import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, requireAdminApi } from "@/lib/api-admin";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ storeId: string }> },
) {
  try {
    const { user, response } = await requireAdminApi();
    if (response) return response;

    const { storeId } = await context.params;
    const store = await prisma.stores.findFirst({
      where: { id: storeId, distributor_id: user.distributorId },
      include: {
        user_store_links: {
          where: { users: { roles: { code: "rdm" } } },
          include: { users: { include: { roles: true } } },
        },
      },
    });

    if (!store) return jsonError("Magasin introuvable.", 404);
    return NextResponse.json({
      success: true,
      rdm: store.user_store_links[0]?.users ?? null,
    });
  } catch (error) {
    return jsonError("Erreur serveur.", 500, error);
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ storeId: string }> },
) {
  try {
    const { user, response } = await requireAdminApi();
    if (response) return response;

    const { storeId } = await context.params;
    const body = await req.json();
    const rdmId = String(body.rdmId || body.user_id || "").trim();

    const store = await prisma.stores.findFirst({
      where: { id: storeId, distributor_id: user.distributorId },
    });
    if (!store) return jsonError("Magasin introuvable.", 404);

    if (rdmId) {
      const rdm = await prisma.users.findFirst({
        where: { id: rdmId, distributor_id: user.distributorId, roles: { code: "rdm" } },
      });
      if (!rdm) return jsonError("RDM introuvable.", 404);
    }

    await prisma.$transaction(async (tx) => {
      await tx.user_store_links.deleteMany({
        where: { store_id: storeId, users: { roles: { code: "rdm" } } },
      });

      if (rdmId) {
        await tx.user_store_links.create({
          data: { store_id: storeId, user_id: rdmId },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return jsonError("Erreur serveur.", 500, error);
  }
}

export const PATCH = PUT;
