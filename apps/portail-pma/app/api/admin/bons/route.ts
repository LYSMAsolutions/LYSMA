import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, requireAdminApi, toJsonSafe } from "@/lib/api-admin";

type BonLineInput = {
  quantity?: number | string;
  item_type?: string;
  reference?: string;
  designation?: string;
  unit_price?: number | string | null;
  comment?: string;
};

async function generateBonNumber(distributorId: string) {
  const year = new Date().getFullYear();
  const count = await prisma.bons.count({ where: { distributor_id: distributorId } });
  return `BON-${year}-${String(count + 1).padStart(5, "0")}`;
}

export async function GET(req: NextRequest) {
  try {
    const { user, response } = await requireAdminApi();
    if (response) return response;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status")?.trim();
    const search = searchParams.get("search")?.trim();

    const bons = await prisma.bons.findMany({
      where: {
        distributor_id: user.distributorId,
        ...(status ? { status } : {}),
        ...(search
          ? {
              OR: [
                { bon_number: { contains: search, mode: "insensitive" } },
                { bon_type: { contains: search, mode: "insensitive" } },
                { clients: { name: { contains: search, mode: "insensitive" } } },
                { stores: { name: { contains: search, mode: "insensitive" } } },
              ],
            }
          : {}),
      },
      include: {
        clients: { select: { id: true, code: true, name: true } },
        stores: { select: { id: true, code: true, name: true } },
        users: { select: { id: true, first_name: true, last_name: true, email: true } },
        store_staff: { select: { id: true, first_name: true, last_name: true, initials: true } },
        _count: { select: { bon_lines: true, bon_comments: true, bon_photos: true, documents: true, bon_anomalies: true } },
      },
      orderBy: { created_at: "desc" },
      take: 250,
    });

    return NextResponse.json({ success: true, bons: toJsonSafe(bons) });
  } catch (error) {
    return jsonError("Erreur serveur.", 500, error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, response } = await requireAdminApi();
    if (response) return response;

    const body = await req.json();
    const clientId = String(body.client_id || body.clientId || "").trim();
    const storeId = String(body.assigned_store_id || body.storeId || "").trim() || null;
    const bonType = String(body.bon_type || body.bonType || "").trim();
    const status = String(body.status || "brouillon").trim();

    if (!clientId || !bonType) return jsonError("Client et type de bon obligatoires.", 400);

    const client = await prisma.clients.findFirst({
      where: { id: clientId, distributor_id: user.distributorId },
    });
    if (!client) return jsonError("Client introuvable.", 404);

    if (storeId) {
      const store = await prisma.stores.findFirst({
        where: { id: storeId, distributor_id: user.distributorId },
      });
      if (!store) return jsonError("Magasin introuvable.", 404);
    }

    const bon = await prisma.bons.create({
      data: {
        distributor_id: user.distributorId,
        created_by_user_id: user.id,
        client_id: clientId,
        assigned_store_id: storeId,
        bon_number: body.bon_number || (await generateBonNumber(user.distributorId)),
        bon_type: bonType,
        status,
        title: String(body.title || "").trim() || null,
        comment: String(body.comment || "").trim() || null,
        priority: String(body.priority || "normal").trim(),
        bon_lines: {
          create: Array.isArray(body.lines)
            ? (body.lines as BonLineInput[]).map((line: BonLineInput, index: number) => ({
                line_number: index + 1,
                quantity: line.quantity ?? 1,
                item_type: line.item_type || "reference",
                reference: String(line.reference || "").trim() || null,
                designation: String(line.designation || "").trim() || null,
                unit_price: line.unit_price ?? null,
                comment: String(line.comment || "").trim() || null,
              }))
            : [],
        },
      },
    });

    await prisma.bon_status_history.create({
      data: {
        bon_id: bon.id,
        old_status: null,
        new_status: status,
        action_key: "creation_admin",
        changed_by_user_id: user.id,
      },
    });

    return NextResponse.json({ success: true, bon: toJsonSafe(bon) });
  } catch (error) {
    return jsonError("Erreur serveur.", 500, error);
  }
}
