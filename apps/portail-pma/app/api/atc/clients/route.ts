import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";

// GET /api/atc/clients — liste les clients de l'ATC
export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "atc")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const clients = await prisma.clients.findMany({
      where: { distributor_id: session.user.distributorId, assigned_user_id: session.user.id },
      include: { stores: { select: { id: true, name: true, code: true } } },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, clients });
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

// POST /api/atc/clients — créer un prospect
export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "atc")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const body = await req.json();

    if (!body.name?.trim())
      return NextResponse.json({ success: false, message: "Le nom est obligatoire." }, { status: 400 });

    const client = await prisma.clients.create({
      data: {
        distributor_id:     session.user.distributorId,
        assigned_user_id:   session.user.id,
        store_id:           body.store_id        || null,
        name:               String(body.name).trim(),
        code:               body.code            ? String(body.code).toUpperCase().trim()            : null,
        billing_name:       body.billing_name    ? String(body.billing_name).trim()                  : null,
        representative_name:body.representative_name ? String(body.representative_name).trim()       : null,
        phone:              body.phone           ? String(body.phone).trim()                          : null,
        email:              body.email           ? String(body.email).trim()                          : null,
        address_line_1:     body.address_line_1  ? String(body.address_line_1).toUpperCase().trim()  : null,
        postal_code:        body.postal_code     ? String(body.postal_code).trim()                   : null,
        city:               body.city            ? String(body.city).toUpperCase().trim()             : null,
        is_active:          true,
      },
      include: { stores: { select: { id: true, name: true, code: true } } },
    });

    return NextResponse.json({ success: true, client });
  } catch {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}
