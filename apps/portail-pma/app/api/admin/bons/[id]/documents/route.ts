import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError, requireAdminApi, toJsonSafe } from "@/lib/api-admin";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { user, response } = await requireAdminApi();
    if (response) return response;

    const { id } = await context.params;
    const bon = await prisma.bons.findFirst({ where: { id, distributor_id: user.distributorId }, select: { id: true } });
    if (!bon) return jsonError("Bon introuvable.", 404);

    const documents = await prisma.documents.findMany({
      where: { bon_id: id, distributor_id: user.distributorId, is_active: true },
      include: { document_versions_documents_current_version_idTodocument_versions: true },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ success: true, documents: toJsonSafe(documents) });
  } catch (error) {
    return jsonError("Erreur serveur.", 500, error);
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { user, response } = await requireAdminApi();
    if (response) return response;

    const { id } = await context.params;
    const body = await req.json();
    const title = String(body.title || "").trim();
    if (!title) return jsonError("Titre document obligatoire.", 400);

    const bon = await prisma.bons.findFirst({
      where: { id, distributor_id: user.distributorId },
      select: { id: true, client_id: true },
    });
    if (!bon) return jsonError("Bon introuvable.", 404);

    const document = await prisma.documents.create({
      data: {
        distributor_id: user.distributorId,
        bon_id: id,
        client_id: bon.client_id,
        generated_by_user_id: user.id,
        document_type: String(body.document_type || "piece_jointe").trim(),
        document_status: String(body.document_status || "published").trim(),
        title,
        description: String(body.description || "").trim() || null,
      },
    });

    return NextResponse.json({ success: true, document: toJsonSafe(document) });
  } catch (error) {
    return jsonError("Erreur serveur.", 500, error);
  }
}
