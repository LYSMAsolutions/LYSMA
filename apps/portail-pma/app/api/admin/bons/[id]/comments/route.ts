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

    const comments = await prisma.bon_comments.findMany({
      where: { bon_id: id, is_deleted: false },
      include: {
        users: { select: { id: true, first_name: true, last_name: true } },
        store_staff: { select: { id: true, first_name: true, last_name: true, initials: true } },
      },
      orderBy: { created_at: "asc" },
    });

    return NextResponse.json({ success: true, comments: toJsonSafe(comments) });
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
    const content = String(body.content || "").trim();
    if (!content) return jsonError("Commentaire obligatoire.", 400);

    const bon = await prisma.bons.findFirst({ where: { id, distributor_id: user.distributorId }, select: { id: true } });
    if (!bon) return jsonError("Bon introuvable.", 404);

    const comment = await prisma.bon_comments.create({
      data: {
        bon_id: id,
        author_user_id: user.id,
        comment_type: String(body.comment_type || "internal").trim(),
        visibility: String(body.visibility || "internal").trim(),
        content,
      },
    });

    return NextResponse.json({ success: true, comment: toJsonSafe(comment) });
  } catch (error) {
    return jsonError("Erreur serveur.", 500, error);
  }
}
