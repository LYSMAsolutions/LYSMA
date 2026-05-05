import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const client = await prisma.clients.findUnique({ where: { id } });
  if (!client) return NextResponse.json({ success: false, message: "Client introuvable." }, { status: 404 });
  return NextResponse.json({ success: true, client });
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const { id }         = await context.params;
    const body           = await req.json();
    const code           = String(body.code           || "").trim().toUpperCase();
    const name           = String(body.name           || "").trim();
    const addressLine1   = String(body.address        || "").trim();
    const postalCode     = String(body.postalCode     || "").trim();
    const city           = String(body.city           || "").trim();
    const email          = String(body.email          || "").trim().toLowerCase();
    const phone          = String(body.phone          || "").trim();
    const storeId        = String(body.storeId        || "").trim();
    const assignedUserId = String(body.assignedUserId || "").trim();

    if (!name) return NextResponse.json({ success: false, message: "Le nom client est obligatoire." }, { status: 400 });

    const current = await prisma.clients.findFirst({
      where: { id, distributor_id: session.user.distributorId },
    });
    if (!current) return NextResponse.json({ success: false, message: "Client introuvable." }, { status: 404 });

    if (code) {
      const conflict = await prisma.clients.findFirst({
        where: { distributor_id: current.distributor_id, code, NOT: { id } },
      });
      if (conflict)
        return NextResponse.json({ success: false, message: "Un autre client utilise déjà ce code." }, { status: 409 });
    }

    const updated = await prisma.clients.update({
      where: { id },
      data: {
        code:            code           || null,
        name,
        address_line_1:  addressLine1   || null,
        postal_code:     postalCode     || null,
        city:            city           || null,
        email:           email          || null,
        phone:           phone          || null,
        store_id:        storeId        || null,
        assigned_user_id: assignedUserId || null,
      },
    });

    return NextResponse.json({ success: true, clientId: updated.id });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur.", error: error instanceof Error ? error.message : "unknown" }, { status: 500 });
  }
}