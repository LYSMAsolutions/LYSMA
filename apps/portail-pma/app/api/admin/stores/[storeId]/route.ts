import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";

const VALID_TYPES = ["standard", "sav"];

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ storeId: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const { storeId } = await context.params;
    const id = storeId;

    const existing = await prisma.stores.findFirst({
      where: { id, distributor_id: session.user.distributorId },
    });
    if (!existing)
      return NextResponse.json({ success: false, message: "Magasin introuvable." }, { status: 404 });

    const body      = await req.json();
    const code      = String(body.code  || "").trim().toUpperCase();
    const name      = String(body.name  || "").trim();
    const isActive  = body.isActive !== undefined ? Boolean(body.isActive) : existing.is_active;
    const rdmId     = String(body.rdmId || "").trim() || null;
    const storeType = VALID_TYPES.includes(body.storeType) ? body.storeType : existing.store_type;

    const email  = body.email  !== undefined ? (String(body.email).trim().toLowerCase()  || null) : existing.email;
    const phone  = body.phone  !== undefined ? (String(body.phone).trim()                || null) : existing.phone;
    const addr1  = body.addr1  !== undefined ? (String(body.addr1).trim()                || null) : existing.address_line_1;
    const addr2  = body.addr2  !== undefined ? (String(body.addr2).trim()                || null) : existing.address_line_2;
    const postal = body.postal !== undefined ? (String(body.postal).trim()               || null) : existing.postal_code;
    const city   = body.city   !== undefined ? (String(body.city).trim()                 || null) : existing.city;

    if (!code || !name)
      return NextResponse.json({ success: false, message: "Code et nom obligatoires." }, { status: 400 });

    if (code !== existing.code) {
      const conflict = await prisma.stores.findFirst({
        where: { distributor_id: session.user.distributorId, code, NOT: { id } },
      });
      if (conflict)
        return NextResponse.json({ success: false, message: "Un magasin avec ce code existe déjà." }, { status: 409 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.stores.update({
        where: { id },
        data: { code, name, email, phone, address_line_1: addr1, address_line_2: addr2, postal_code: postal, city, is_active: isActive, store_type: storeType },
      });

      await tx.user_store_links.deleteMany({
        where: { store_id: id, users: { roles: { code: "rdm" } } },
      });
      if (rdmId) {
        await tx.user_store_links.upsert({
          where: { user_id_store_id: { user_id: rdmId, store_id: id } },
          create: { user_id: rdmId, store_id: id },
          update: {},
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur.", error: error instanceof Error ? error.message : "unknown" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ storeId: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const { storeId } = await context.params;
    const id = storeId;

    const bonCount = await prisma.bons.count({
      where: { assigned_store_id: id, status: { notIn: ["traite", "refuse"] } },
    });
    if (bonCount > 0)
      return NextResponse.json({ success: false, message: `Impossible : ${bonCount} bon(s) actif(s) sur ce magasin.` }, { status: 400 });

    await prisma.stores.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}