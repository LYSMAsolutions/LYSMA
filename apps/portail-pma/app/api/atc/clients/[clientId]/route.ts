import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";

// PATCH /api/atc/clients/[clientId] — mettre à jour une fiche client
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ clientId: string }> }) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "atc")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const { clientId } = await params;
    const body = await req.json();

    // Vérifier que le client appartient à cet ATC
    const existing = await prisma.clients.findFirst({
      where: { id: clientId, distributor_id: session.user.distributorId, assigned_user_id: session.user.id },
    });
    if (!existing)
      return NextResponse.json({ success: false, message: "Client introuvable." }, { status: 404 });

    // Champs que l'ATC peut modifier
    const data: Record<string, unknown> = {};
    if (body.name               !== undefined) data.name                = String(body.name).trim();
    if (body.code               !== undefined) data.code                = body.code ? String(body.code).toUpperCase().trim() : null;
    if (body.billing_name       !== undefined) data.billing_name        = body.billing_name ? String(body.billing_name).trim() : null;
    if (body.representative_name!== undefined) data.representative_name = body.representative_name ? String(body.representative_name).trim() : null;
    if (body.phone              !== undefined) data.phone               = body.phone ? String(body.phone).trim() : null;
    if (body.email              !== undefined) data.email               = body.email ? String(body.email).trim() : null;
    if (body.address_line_1     !== undefined) data.address_line_1      = body.address_line_1 ? String(body.address_line_1).toUpperCase().trim() : null;
    if (body.postal_code        !== undefined) data.postal_code         = body.postal_code ? String(body.postal_code).trim() : null;
    if (body.city               !== undefined) data.city                = body.city ? String(body.city).toUpperCase().trim() : null;
    if (body.store_id           !== undefined) data.store_id            = body.store_id || null;
    // Finalisation prospect → client
    if (body.status             !== undefined) data.status              = body.status;
    data.updated_at = new Date();

    const client = await prisma.clients.update({
      where: { id: clientId },
      data,
      include: { stores: { select: { id: true, name: true, code: true } } },
    });

    return NextResponse.json({ success: true, client });
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}