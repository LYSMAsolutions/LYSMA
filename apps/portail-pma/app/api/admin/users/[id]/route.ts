import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth-session";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const user = await prisma.users.findUnique({
    where: { id },
    include: { roles: true, _count: { select: { clients: true, bons: true } }, user_store_links: { include: { stores: true } } },
  });
  if (!user) return NextResponse.json({ success: false, message: "Introuvable." }, { status: 404 });
  return NextResponse.json({ success: true, user });
}

// PATCH — profil + rôle uniquement (pas de statut)
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

    const firstName = String(body.firstName || "").trim();
    const lastName  = String(body.lastName  || "").trim();
    const email     = String(body.email     || "").trim().toLowerCase();
    const phone     = String(body.phone     || "").trim();
    const code      = String(body.code      || "").trim().toUpperCase();
    const roleId    = String(body.roleId    || "").trim();

    if (!firstName || !lastName || !email || !roleId)
      return NextResponse.json({ success: false, message: "Champs obligatoires manquants." }, { status: 400 });

    // Vérifier email unique
    const existing = await prisma.users.findFirst({ where: { email, NOT: { id } } });
    if (existing)
      return NextResponse.json({ success: false, message: "Email déjà utilisé." }, { status: 409 });

    // Si changement de rôle depuis ATC : vérifier remplacement fourni
    const currentUser = await prisma.users.findUnique({ where: { id }, include: { roles: true } });
    if (!currentUser) return NextResponse.json({ success: false, message: "Utilisateur introuvable." }, { status: 404 });

    const newRole = await prisma.roles.findUnique({ where: { id: roleId } });
    if (!newRole) return NextResponse.json({ success: false, message: "Rôle introuvable." }, { status: 400 });

    const wasAtc = currentUser.roles?.code === "atc";
    const isNoLongerAtc = newRole.code !== "atc";

    if (wasAtc && isNoLongerAtc) {
      const replacementId = String(body.replacementUserId || "").trim();
      const clientCount = await prisma.clients.count({ where: { assigned_user_id: id } });
      const bonCount    = await prisma.bons.count({ where: { created_by_user_id: id, status: { notIn: ["traite", "refuse"] } } });

      if ((clientCount > 0 || bonCount > 0) && !replacementId)
        return NextResponse.json({ success: false, message: "Remplacement requis : cet ATC a des clients ou bons actifs.", requiresReplacement: true, clientCount, bonCount }, { status: 400 });

      if (replacementId) {
        await prisma.$transaction([
          prisma.clients.updateMany({ where: { assigned_user_id: id }, data: { assigned_user_id: replacementId } }),
          prisma.bons.updateMany({ where: { created_by_user_id: id, status: { notIn: ["traite", "refuse"] } }, data: { created_by_user_id: replacementId } }),
        ]);
      }
    }

const supervisorId = String(body.supervisorId || "").trim() || null;

const updated = await prisma.users.update({
  where: { id },
  data: {
    first_name: firstName,
    last_name: lastName,
    email,
    phone: phone || null,
    code: code || null,
    role_id: roleId,
    supervisor_id: supervisorId,
  },
});

    return NextResponse.json({ success: true, userId: updated.id });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur.", error: error instanceof Error ? error.message : "unknown" }, { status: 500 });
  }
}

// DELETE — avec remplacement optionnel pour ATC
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session || session.user.roleCode !== "admin")
      return NextResponse.json({ success: false, message: "Accès refusé." }, { status: 403 });

    const { id } = await context.params;

    // Interdire auto-suppression
    if (id === session.user.id)
      return NextResponse.json({ success: false, message: "Impossible de supprimer votre propre compte." }, { status: 400 });

    const body = await req.json().catch(() => ({}));
    const replacementId = String(body.replacementUserId || "").trim();

    const target = await prisma.users.findUnique({ where: { id }, include: { roles: true } });
    if (!target) return NextResponse.json({ success: false, message: "Utilisateur introuvable." }, { status: 404 });

    // Si ATC : vérifier remplacement
    if (target.roles?.code === "atc") {
      const clientCount = await prisma.clients.count({ where: { assigned_user_id: id } });
      const bonCount    = await prisma.bons.count({ where: { created_by_user_id: id, status: { notIn: ["traite", "refuse"] } } });

      if ((clientCount > 0 || bonCount > 0) && !replacementId)
        return NextResponse.json({ success: false, message: "Remplacement requis avant suppression.", requiresReplacement: true, clientCount, bonCount }, { status: 400 });

      if (replacementId) {
        await prisma.$transaction([
          prisma.clients.updateMany({ where: { assigned_user_id: id }, data: { assigned_user_id: replacementId } }),
          prisma.bons.updateMany({ where: { created_by_user_id: id, status: { notIn: ["traite", "refuse"] } }, data: { created_by_user_id: replacementId } }),
        ]);
      }
    }

    await prisma.users.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erreur serveur.", error: error instanceof Error ? error.message : "unknown" }, { status: 500 });
  }
}