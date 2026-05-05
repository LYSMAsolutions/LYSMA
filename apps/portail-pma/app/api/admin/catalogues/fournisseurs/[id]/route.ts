import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const { id } = await context.params;
    const body = await req.json();

    const existing = await prisma.suppliers.findFirst({
      where: { id, distributor_id: session.user.distributorId },
    });
    if (!existing)
      return NextResponse.json({ success: false, message: "Fournisseur introuvable." }, { status: 404 });

    const newCode = body.code ? String(body.code).trim().toUpperCase() : null;

    // Si le code change — vérifier unicité + mettre à jour en cascade
    if (newCode && newCode !== existing.code) {
      const conflict = await prisma.suppliers.findFirst({
        where: {
          distributor_id: session.user.distributorId,
          code: newCode,
          NOT: { id },
        },
      });
      if (conflict)
        return NextResponse.json({ success: false, message: "Ce code fournisseur est déjà utilisé." }, { status: 409 });

      await prisma.$transaction(async (tx) => {
        // Mettre à jour les lignes d'import qui référencent l'ancien code
        await tx.catalogue_import_staging.updateMany({
          where: {
            supplier_code:  existing.code,
            distributor_id: session.user.distributorId,
          },
          data: { supplier_code: newCode },
        });
        // Mettre à jour le fournisseur
        await tx.suppliers.update({
          where: { id },
          data: {
            code:      newCode,
            name:      body.name      !== undefined ? String(body.name).trim()                          : undefined,
            email:     body.email     !== undefined ? (String(body.email).trim().toLowerCase() || null) : undefined,
            phone:     body.phone     !== undefined ? (String(body.phone).trim()                || null) : undefined,
            website:   body.website   !== undefined ? (String(body.website).trim()              || null) : undefined,
            notes:     body.notes     !== undefined ? (String(body.notes).trim()                || null) : undefined,
            is_active: body.is_active !== undefined ? Boolean(body.is_active)                           : undefined,
          },
        });
      });
    } else {
      // Pas de changement de code — simple update
      await prisma.suppliers.update({
        where: { id },
        data: {
          name:      body.name      !== undefined ? String(body.name).trim()                          : undefined,
          email:     body.email     !== undefined ? (String(body.email).trim().toLowerCase() || null) : undefined,
          phone:     body.phone     !== undefined ? (String(body.phone).trim()                || null) : undefined,
          website:   body.website   !== undefined ? (String(body.website).trim()              || null) : undefined,
          notes:     body.notes     !== undefined ? (String(body.notes).trim()                || null) : undefined,
          is_active: body.is_active !== undefined ? Boolean(body.is_active)                           : undefined,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur.", error: error instanceof Error ? error.message : "unknown" }, { status: 500 });
  }
}