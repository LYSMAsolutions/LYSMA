import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ success: false, message: "Non autorisé." }, { status: 401 });

  const clients = await prisma.clients.findMany({
    where: { distributor_id: session.user.distributorId },
    orderBy: { created_at: "desc" },
  });
  return NextResponse.json({ success: true, clients });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const body           = await req.json();
    const distributorId  = String(body.distributorId  || "").trim();
    const code           = String(body.code           || "").trim().toUpperCase();
    const name           = String(body.name           || "").trim();
    const addressLine1   = String(body.address        || "").trim();
    const postalCode     = String(body.postalCode     || "").trim();
    const city           = String(body.city           || "").trim();
    const email          = String(body.email          || "").trim().toLowerCase();
    const phone          = String(body.phone          || "").trim();
    const storeId        = String(body.storeId        || "").trim();
    const assignedUserId = String(body.assignedUserId || "").trim();

    if (!distributorId || !name)
      return NextResponse.json({ success: false, message: "Le distributeur et le nom client sont obligatoires." }, { status: 400 });

    if (code) {
      const existing = await prisma.clients.findFirst({ where: { distributor_id: distributorId, code } });
      if (existing)
        return NextResponse.json({ success: false, message: "Un client avec ce code existe déjà." }, { status: 409 });
    }

    const created = await prisma.clients.create({
      data: {
        distributor_id:  distributorId,
        code:            code           || null,
        name,
        address_line_1:  addressLine1   || null,
        postal_code:     postalCode     || null,
        city:            city           || null,
        email:           email          || null,
        phone:           phone          || null,
        store_id:        storeId        || null,
        assigned_user_id: assignedUserId || null,
        is_active: true,
      },
    });

    return NextResponse.json({ success: true, clientId: created.id });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur.", error: error instanceof Error ? error.message : "unknown" }, { status: 500 });
  }
}