import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ storeId: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const { storeId } = await context.params;

    const store = await prisma.stores.findFirst({
      where: { id: storeId, distributor_id: session.user.distributorId },
    });
    if (!store)
      return NextResponse.json({ success: false, message: "Magasin introuvable." }, { status: 404 });

    const body      = await req.json();
    const firstName = String(body.firstName || "").trim();
    const lastName  = String(body.lastName  || "").trim();
    const initials  = String(body.initials  || "").trim().toUpperCase();
    const pin       = String(body.pin       || "").trim();

    if (!firstName || !lastName || !initials || !pin)
      return NextResponse.json({ success: false, message: "Tous les champs sont obligatoires." }, { status: 400 });

    if (pin.length < 4 || !/^\d+$/.test(pin))
      return NextResponse.json({ success: false, message: "PIN invalide — minimum 4 chiffres." }, { status: 400 });

    const existing = await prisma.store_staff.findFirst({ where: { store_id: storeId, initials } });
    if (existing)
      return NextResponse.json({ success: false, message: `Initiales "${initials}" déjà utilisées dans ce magasin.` }, { status: 409 });

    const created = await prisma.store_staff.create({
      data: {
        store_id:        storeId,
        first_name:      firstName,
        last_name:       lastName,
        initials,
        pin_hash:        await bcrypt.hash(pin, 10),
        is_active:       true,
        must_change_pin: true,
      },
    });

    return NextResponse.json({ success: true, staffId: created.id });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur.", error: error instanceof Error ? error.message : "unknown" }, { status: 500 });
  }
}