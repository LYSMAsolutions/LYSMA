import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ staffId: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const { staffId } = await context.params;
    const body = await req.json();

    const staff = await prisma.store_staff.findFirst({
      where: { id: staffId, stores: { distributor_id: session.user.distributorId } },
    });
    if (!staff)
      return NextResponse.json({ success: false, message: "Magasinier introuvable." }, { status: 404 });

    const firstName     = String(body.firstName     || "").trim();
    const lastName      = String(body.lastName      || "").trim();
    const initials      = String(body.initials      || "").trim().toUpperCase();
    const pin           = body.pin ? String(body.pin).trim() : null;
    const isActive      = body.isActive      !== undefined ? Boolean(body.isActive)      : staff.is_active;
    const mustChangePin = body.mustChangePin !== undefined ? Boolean(body.mustChangePin) : staff.must_change_pin;
    const newStoreId    = body.storeId       ? String(body.storeId).trim()               : null;

    if (!firstName || !lastName || !initials)
      return NextResponse.json({ success: false, message: "Prénom, nom et initiales obligatoires." }, { status: 400 });

    const targetStoreId = newStoreId || staff.store_id;

    // Unicité initiales dans le magasin cible
    const conflict = await prisma.store_staff.findFirst({
      where: { store_id: targetStoreId, initials, NOT: { id: staffId } },
    });
    if (conflict)
      return NextResponse.json({ success: false, message: "Ces initiales sont déjà utilisées dans ce magasin." }, { status: 409 });

    // Vérifier que le magasin cible appartient au distributeur
    if (newStoreId) {
      const targetStore = await prisma.stores.findFirst({
        where: { id: newStoreId, distributor_id: session.user.distributorId },
      });
      if (!targetStore)
        return NextResponse.json({ success: false, message: "Magasin de destination introuvable." }, { status: 404 });
    }

    await prisma.store_staff.update({
      where: { id: staffId },
      data: {
        first_name:      firstName,
        last_name:       lastName,
        initials,
        is_active:       isActive,
        must_change_pin: mustChangePin,
        store_id:        targetStoreId,
        ...(pin ? { pin_hash: await bcrypt.hash(pin, 10), pin_updated_at: new Date() } : {}),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur.", error: error instanceof Error ? error.message : "unknown" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ staffId: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const { staffId } = await context.params;

    const staff = await prisma.store_staff.findFirst({
      where: { id: staffId, stores: { distributor_id: session.user.distributorId } },
    });
    if (!staff)
      return NextResponse.json({ success: false, message: "Magasinier introuvable." }, { status: 404 });

    await prisma.$transaction(async (tx) => {
      // Détacher les bons — le bon reste sur le magasin (assigned_store_id intact)
      await tx.bons.updateMany({
        where: { taken_by_staff_id: staffId },
        data:  { taken_by_staff_id: null },
      });
      // Supprimer le magasinier
      await tx.store_staff.delete({ where: { id: staffId } });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur." }, { status: 500 });
  }
}

// POST /api/admin/stores/staff/[staffId]/promote — crée un user depuis le magasinier
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ staffId: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const { staffId } = await context.params;
    const body = await req.json();

    const staff = await prisma.store_staff.findFirst({
      where: { id: staffId, stores: { distributor_id: session.user.distributorId } },
    });
    if (!staff)
      return NextResponse.json({ success: false, message: "Magasinier introuvable." }, { status: 404 });

    const email    = String(body.email    || "").trim().toLowerCase();
    const password = String(body.password || "").trim();
    const roleId   = String(body.roleId   || "").trim();

    if (!email || !password || !roleId)
      return NextResponse.json({ success: false, message: "Email, mot de passe et rôle obligatoires." }, { status: 400 });

    // Vérifier unicité email
    const emailConflict = await prisma.users.findFirst({
      where: { distributor_id: session.user.distributorId, email },
    });
    if (emailConflict)
      return NextResponse.json({ success: false, message: "Cet email est déjà utilisé." }, { status: 409 });

    await prisma.$transaction(async (tx) => {
      // Créer l'utilisateur
      await tx.users.create({
        data: {
          distributor_id:       session.user.distributorId,
          role_id:              roleId,
          first_name:           staff.first_name,
          last_name:            staff.last_name,
          email,
          password_hash:        await bcrypt.hash(password, 10),
          is_active:            true,
          must_change_password: true,
        },
      });
      // Désactiver le magasinier
      await tx.store_staff.update({
        where: { id: staffId },
        data:  { is_active: false },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur.", error: error instanceof Error ? error.message : "unknown" }, { status: 500 });
  }
}